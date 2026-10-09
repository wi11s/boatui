'use client';

// Shared frame for every 3D scene: canvas sizing, render loop, pausing, theming and cleanup.
// Scenes provide a module-level `setup` function; this frame owns everything else.

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import * as THREE from 'three';
import styles from './three-frame.module.css';

/** Props every 3D scene accepts. `T` is the scene's theme (colour tokens). */
export type ThreeSceneProps<T> = {
  /** Override any of the scene's colours. Updates live without rebuilding the scene. */
  theme?: Partial<T>;
  /** Freeze the animation. Scenes also stop rendering while off-screen or in a hidden tab. */
  paused?: boolean;
  /** Animation speed multiplier (default 1). */
  speed?: number;
  className?: string;
  style?: CSSProperties;
  /** Content rendered on top of the canvas. */
  children?: ReactNode;
};

export type SceneContext<T> = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  theme: T;
};

export type SceneController<T> = {
  /** Advance the scene to `time` seconds (scaled by `speed`). */
  update: (time: number) => void;
  /** Apply new colours to existing materials and lights. */
  setTheme: (theme: T) => void;
};

/** Build the scene once. Must be defined at module level so its identity is stable. */
export type SceneSetup<T> = (ctx: SceneContext<T>) => SceneController<T>;

/** True when the browser can create a WebGL context. The probe context is released immediately. */
function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/** Deterministic PRNG so scenes look the same on every load. */
export function seeded(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type ThreeFrameProps<T extends Record<string, string>> = ThreeSceneProps<T> & {
  defaultTheme: T;
  setup: SceneSetup<T>;
  /** CSS background behind the transparent canvas, e.g. a sky gradient. */
  background?: (theme: T) => string;
  /** Time shown as a still frame under prefers-reduced-motion. */
  stillTime?: number;
};

export function ThreeFrame<T extends Record<string, string>>({
  defaultTheme,
  setup,
  background,
  stillTime = 4,
  theme,
  paused = false,
  speed = 1,
  className,
  style,
  children,
}: ThreeFrameProps<T>) {
  const hostRef = useRef<HTMLDivElement>(null);
  const merged = useMemo(() => ({ ...defaultTheme, ...theme }) as T, [defaultTheme, theme]);

  // Live values read by the render loop without restarting it.
  const live = useRef({ theme: merged, paused, speed });
  live.current.speed = speed;
  const control = useRef<{ schedule: () => void; redraw: () => void; setTheme: (t: T) => void } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Without WebGL, leave the CSS background and children visible (and skip three.js's console errors).
    if (!webglAvailable()) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return; // No WebGL: leave the background and children visible.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = styles.canvas;
    host.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
    const controller = setup({ scene, camera, renderer, theme: live.current.theme });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let time = reduceMotion.matches ? stillTime : 0;
    let last = 0;
    let raf = 0;

    const draw = () => {
      controller.update(time);
      renderer.render(scene, camera);
    };
    const running = () => visible && !live.current.paused && !reduceMotion.matches && !document.hidden;
    const frame = (now: number) => {
      raf = 0;
      if (!running()) return;
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += delta * live.current.speed;
      draw();
      raf = requestAnimationFrame(frame);
    };
    const schedule = () => {
      if (reduceMotion.matches) time = stillTime;
      if (running() && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!running()) {
        draw();
      }
    };

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    intersectionObserver.observe(host);
    document.addEventListener('visibilitychange', schedule);
    reduceMotion.addEventListener('change', schedule);

    control.current = { schedule, redraw: draw, setTheme: controller.setTheme };
    resize();
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', schedule);
      reduceMotion.removeEventListener('change', schedule);
      control.current = null;
      scene.traverse(object => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        materials.forEach(m => m.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [setup, stillTime]);

  useEffect(() => {
    live.current.theme = merged;
    control.current?.setTheme(merged);
    control.current?.redraw();
  }, [merged]);

  useEffect(() => {
    live.current.paused = paused;
    control.current?.schedule();
  }, [paused]);

  const classes = [styles.root, className].filter(Boolean).join(' ');
  return (
    <div ref={hostRef} className={classes} style={{ background: background?.(merged), ...style }}>
      {children && <div className={styles.overlay}>{children}</div>}
    </div>
  );
}
