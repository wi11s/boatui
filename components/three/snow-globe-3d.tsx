'use client';

// <SnowGlobe3D>: a snow globe on a wooden base, holding a cabin with a lit window, snowy pines and
// a snowman. Snow swirls slowly inside the glass; every 14 seconds the globe gives a little shake
// and the snow whirls round faster before settling again. The diorama turns slowly on its base. three.js.

import * as THREE from 'three';
import { ThreeFrame, seeded, type SceneSetup, type ThreeSceneProps } from './three-frame';

export const snowGlobeTheme = {
  skyTop: '#1d2547',
  skyBottom: '#3b3f6e',
  table: '#5a3f37',
  base: '#7a4a32',
  rim: '#d9b25f',
  snow: '#f4f7fb',
  cabin: '#b5623e',
  roof: '#5e3a2e',
  window: '#ffcf6b',
  pine: '#2f6b4f',
  carrot: '#f08a3c',
  glass: '#cfe6ff',
};
export type SnowGlobeTheme = typeof snowGlobeTheme;

const FLAKES = 160;
const SHAKE_EVERY = 14;

// The glass sphere: centre and radius. It sits in the base's rim.
const GLOBE_Y = 1.75;
const GLOBE_R = 1.5;
const FLOOR_Y = 0.72;

/** Glass: nearly clear head-on, brighter at grazing angles, with one sharp highlight. */
function glassMaterial(color: string) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { tint: { value: new THREE.Color(color) }, light: { value: new THREE.Vector3(-0.5, 0.7, 0.6).normalize() } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 tint;
      uniform vec3 light;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float rim = pow(1.0 - abs(dot(vNormal, vView)), 2.5);
        float spec = pow(max(dot(reflect(-light, vNormal), vView), 0.0), 60.0);
        vec3 color = mix(tint, vec3(1.0), spec);
        gl_FragColor = vec4(color, 0.05 + rim * 0.45 + spec * 0.9);
      }`,
  });
}

/** 0 → 1 → 0 over the first part of each shake cycle, easing out: how hard the globe is shaking. */
const shakeEnvelope = (s: number) => (s < 0.12 ? Math.sin((s / 0.12) * Math.PI) : 0);
/** How far the swirl has been pushed by every shake so far, so flakes speed up and settle smoothly. */
function swirlBoost(t: number) {
  const cycles = Math.floor(t / SHAKE_EVERY);
  const s = (t % SHAKE_EVERY) / SHAKE_EVERY;
  const settle = 1 - (1 - Math.min(1, s / 0.5)) ** 3;
  return (cycles + settle) * 5;
}

const setup: SceneSetup<SnowGlobeTheme> = ({ scene, camera, theme }) => {
  const rand = seeded(23);
  scene.fog = new THREE.Fog(theme.skyBottom, 8, 13);

  const flat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...extra });
  const mats = {
    table: flat(theme.table),
    base: flat(theme.base),
    rim: flat(theme.rim, { metalness: 0.6, roughness: 0.35 }),
    snow: flat(theme.snow),
    cabin: flat(theme.cabin),
    roof: flat(theme.roof),
    window: new THREE.MeshBasicMaterial({ color: theme.window }),
    pine: flat(theme.pine),
    trunk: flat('#5b4033'),
    carrot: flat(theme.carrot),
    coal: flat('#2b2b33'),
    flake: new THREE.MeshBasicMaterial({ color: theme.snow }),
    smoke: new THREE.MeshStandardMaterial({ color: '#c9cfdb', transparent: true, depthWrite: false, flatShading: true }),
    glass: glassMaterial(theme.glass),
    shadow: new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.25, depthWrite: false }),
  };

  const hemi = new THREE.HemisphereLight('#c3ceff', theme.table, 1.1);
  const key = new THREE.DirectionalLight('#fff1dc', 1.6);
  key.position.set(-3, 5, 4);
  scene.add(hemi, key);

  // Table top, fading into the room behind.
  const table = new THREE.Mesh(new THREE.CircleGeometry(14, 40), mats.table);
  table.rotation.x = -Math.PI / 2;
  scene.add(table);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.75, 32), mats.shadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.005;
  scene.add(shadow);

  // Base: a tapered wooden plinth with a brass band and a brass collar holding the glass.
  const globe = new THREE.Group();
  scene.add(globe);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 0.55, 28), mats.base);
  plinth.position.y = 0.275;
  globe.add(plinth);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.38, 0.09, 28), mats.rim);
  band.position.y = 0.18;
  globe.add(band);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.18, 28), mats.rim);
  collar.position.y = 0.64;
  globe.add(collar);

  // The world inside: everything on this turntable rotates slowly.
  const inside = new THREE.Group();
  globe.add(inside);
  const floorR = Math.sqrt(GLOBE_R ** 2 - (GLOBE_Y - FLOOR_Y) ** 2);
  // A low dome of snow, lumpier and higher toward the back.
  const floorGeo = new THREE.SphereGeometry(floorR, 28, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  floorGeo.scale(1, 0.14, 1);
  const fp = floorGeo.attributes.position;
  for (let i = 0; i < fp.count; i++) {
    // Bumps are a function of position, so the vertices shared at the dome's pole stay together.
    const x = fp.getX(i);
    const z = fp.getZ(i);
    const bump = (Math.sin(x * 9.1 + z * 3.7) * Math.cos(z * 8.3 - x * 2.9) + 1) * 0.015;
    if (Math.hypot(x, z) / floorR < 0.97) fp.setY(i, fp.getY(i) + bump + Math.max(0, -z) * 0.07);
  }
  floorGeo.computeVertexNormals();
  const floor = new THREE.Mesh(floorGeo, mats.snow);
  floor.position.y = FLOOR_Y - 0.02;
  inside.add(floor);

  // Cabin: walls, a pitched roof with snow on it, a chimney and a glowing window and door.
  const cabin = new THREE.Group();
  const walls = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.5), mats.cabin);
  walls.position.y = 0.21;
  cabin.add(walls);
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-0.4, 0);
  roofShape.lineTo(0.4, 0);
  roofShape.lineTo(0, 0.34);
  roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 0.6, bevelEnabled: false });
  roofGeo.translate(0, 0.42, -0.3);
  cabin.add(new THREE.Mesh(roofGeo, mats.roof));
  for (const side of [-1, 1]) {
    const snowSlab = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.05, 0.64), mats.snow);
    snowSlab.position.set(side * 0.19, 0.61, 0);
    snowSlab.rotation.z = -side * Math.atan2(0.34, 0.4);
    cabin.add(snowSlab);
  }
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.1), mats.roof);
  chimney.position.set(0.18, 0.66, -0.12);
  cabin.add(chimney);
  const windowPane = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.12), mats.window);
  windowPane.position.set(0.14, 0.24, 0.252);
  cabin.add(windowPane);
  const doorPane = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.22), mats.roof);
  doorPane.position.set(-0.14, 0.11, 0.252);
  cabin.add(doorPane);
  cabin.position.set(-0.15, FLOOR_Y + 0.07, -0.3);
  cabin.rotation.y = 0.3;
  inside.add(cabin);

  // Pines with snowy tips.
  const pinePlaces: [number, number, number][] = [
    [0.62, -0.45, 1],
    [0.85, 0.15, 0.75],
    [-0.75, 0.2, 0.85],
    [-0.55, -0.75, 0.7],
  ];
  for (const [x, z, s] of pinePlaces) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.16, 5), mats.trunk);
    trunk.position.y = 0.08;
    tree.add(trunk);
    for (let tier = 0; tier < 3; tier++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3 - tier * 0.07, 0.36, 7), mats.pine);
      cone.position.y = 0.3 + tier * 0.19;
      tree.add(cone);
    }
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.13, 7), mats.snow);
    tip.position.y = 0.73;
    tree.add(tip);
    tree.position.set(x, FLOOR_Y + 0.07, z);
    tree.scale.setScalar(s);
    tree.rotation.y = rand() * Math.PI;
    inside.add(tree);
  }

  // Snowman: three balls, coal eyes and buttons, a carrot nose, facing out.
  const snowman = new THREE.Group();
  [
    [0.17, 0.15],
    [0.12, 0.39],
    [0.09, 0.56],
  ].forEach(([r, y]) => {
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), mats.snow);
    ball.position.y = y;
    snowman.add(ball);
  });
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 6), mats.carrot);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.56, 0.13);
  snowman.add(nose);
  for (const [x, y, z] of [
    [-0.035, 0.6, 0.08],
    [0.035, 0.6, 0.08],
    [0, 0.42, 0.12],
    [0, 0.34, 0.12],
  ]) {
    const coal = new THREE.Mesh(new THREE.IcosahedronGeometry(0.018, 0), mats.coal);
    coal.position.set(x, y, z);
    snowman.add(coal);
  }
  snowman.position.set(0.3, FLOOR_Y + 0.07, 0.5);
  snowman.rotation.y = -0.2;
  inside.add(snowman);

  // Smoke from the chimney, in the cabin's frame so it turns with it.
  const smoke = Array.from({ length: 4 }, (_, k) => {
    const mat = mats.smoke.clone();
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05, 0), mat);
    cabin.add(mesh);
    return { mesh, mat, offset: k / 4 };
  });

  // Snowflakes: each circles the globe's axis at its own radius and drifts down, wrapping to the
  // top. A shake pushes the swirl round faster and flings them toward the glass, then it settles.
  const flakeGeo = new THREE.IcosahedronGeometry(0.022, 0);
  const flakes = Array.from({ length: FLAKES }, () => {
    const mesh = new THREE.Mesh(flakeGeo, mats.flake);
    globe.add(mesh);
    return { mesh, a: rand() * Math.PI * 2, r: Math.sqrt(rand()), fall: 0.05 + rand() * 0.05, offset: rand(), spin: 0.6 + rand() * 0.8 };
  });

  const glassMesh = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R, 48, 32), mats.glass);
  glassMesh.position.y = GLOBE_Y;
  glassMesh.renderOrder = 2;
  globe.add(glassMesh);

  const windowColor = new THREE.Color(theme.window);
  // Flakes start below the top of the glass, where the globe is still wide, so they never bunch up.
  const top = GLOBE_Y + GLOBE_R * 0.72;
  const bottom = FLOOR_Y + 0.12;

  return {
    update(t) {
      camera.position.set(Math.sin(t * 0.05) * 0.8, 2.6, 7.2);
      camera.lookAt(0, 1.3, 0);

      inside.rotation.y = t * 0.12;

      // The shake: a quick decaying wobble at the start of each cycle.
      const s = (t % SHAKE_EVERY) / SHAKE_EVERY;
      const shake = shakeEnvelope(s);
      globe.rotation.z = Math.sin(t * 22) * 0.05 * shake;
      globe.position.x = Math.sin(t * 22 + 1) * 0.04 * shake;
      const boost = swirlBoost(t);

      flakes.forEach(f => {
        const p = (t * f.fall + f.offset) % 1;
        const y = top - p * (top - bottom);
        // The shake also flings flakes outward a little, toward the glass.
        const maxR = Math.sqrt(Math.max(0, GLOBE_R ** 2 - (y - GLOBE_Y) ** 2)) * 0.88;
        const r = Math.min(1, f.r * (1 + shake * 0.3)) * maxR;
        const a = f.a + t * 0.15 * f.spin + boost * f.spin;
        f.mesh.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
        // Shrink into the drifts at the bottom and grow back at the top, so the wrap is invisible.
        f.mesh.scale.setScalar(Math.min(1, p * 12, (1 - p) * 12));
      });

      smoke.forEach(({ mesh, mat, offset }) => {
        const p = (t * 0.25 + offset) % 1;
        mesh.position.set(0.18 + p * 0.12, 0.8 + p * 0.5, -0.12);
        mesh.scale.setScalar(0.6 + p * 1.4);
        mat.opacity = 0.5 * Math.sin(p * Math.PI);
      });

      // The window flickers like a fire inside.
      mats.window.color.copy(windowColor).multiplyScalar(0.9 + Math.sin(t * 7) * 0.07 + Math.sin(t * 11.3) * 0.05);
    },
    setTheme(th) {
      mats.table.color.set(th.table);
      mats.base.color.set(th.base);
      mats.rim.color.set(th.rim);
      mats.snow.color.set(th.snow);
      mats.flake.color.set(th.snow);
      mats.cabin.color.set(th.cabin);
      mats.roof.color.set(th.roof);
            mats.pine.color.set(th.pine);
      mats.carrot.color.set(th.carrot);
      mats.glass.uniforms.tint.value.set(th.glass);
      windowColor.set(th.window);
      hemi.groundColor.set(th.table);
      (scene.fog as THREE.Fog).color.set(th.skyBottom);
    },
  };
};

/** A snow globe with a cabin, pines and a snowman; it shakes now and then and the snow whirls. */
export function SnowGlobe3D(props: ThreeSceneProps<SnowGlobeTheme>) {
  return (
    <ThreeFrame
      {...props}
      defaultTheme={snowGlobeTheme}
      setup={setup}
      stillTime={9}
      background={t => `linear-gradient(${t.skyTop}, ${t.skyBottom} 42%)`}
    />
  );
}
