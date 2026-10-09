'use client';

// <Campfire3D>: a campfire in a night clearing. Layered flame cones flicker and a warm point light
// pulses with them, lighting a ring of stones, a tent, a log bench and the pines around. Embers and
// smoke rise, fireflies blink at the tree line, and the camera drifts slowly. three.js.

import * as THREE from 'three';
import { ThreeFrame, seeded, type SceneSetup, type ThreeSceneProps } from './three-frame';

export const campfireTheme = {
  skyTop: '#0a1028',
  skyBottom: '#1f2a4a',
  ground: '#2f5a3e',
  pine: '#24503a',
  trunk: '#6b4a32',
  tent: '#e4a24a',
  stone: '#8a8f99',
  log: '#7a5236',
  flame: '#ff8a3d',
  flameCore: '#ffe08a',
  firefly: '#d8ff7a',
  moon: '#f1ead8',
};
export type CampfireTheme = typeof campfireTheme;

const EMBERS = 22;
const SMOKE = 6;

const setup: SceneSetup<CampfireTheme> = ({ scene, camera, theme }) => {
  const rand = seeded(17);
  scene.fog = new THREE.Fog(theme.skyBottom, 9, 20);

  const flat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, ...extra });
  const mats = {
    ground: flat(theme.ground),
    pine: flat(theme.pine),
    trunk: flat(theme.trunk),
    tent: flat(theme.tent, { side: THREE.DoubleSide }),
    door: flat('#3a2a22', { side: THREE.DoubleSide }),
    stone: flat(theme.stone),
    log: flat(theme.log),
    char: flat('#2a1d18'),
    // Flames and embers make their own light, so they are unlit and additive.
    flame: new THREE.MeshBasicMaterial({ color: theme.flame, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    core: new THREE.MeshBasicMaterial({ color: theme.flameCore, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }),
    ember: new THREE.MeshBasicMaterial({ color: theme.flameCore }),
    firefly: new THREE.MeshBasicMaterial({ color: theme.firefly }),
    moon: new THREE.MeshBasicMaterial({ color: theme.moon, fog: false }),
  };

  const hemi = new THREE.HemisphereLight('#5d74b8', theme.ground, 0.55);
  const moonLight = new THREE.DirectionalLight('#9fb4ff', 0.7);
  moonLight.position.set(-6, 8, -4);
  const fire = new THREE.PointLight(theme.flame, 30, 0, 2);
  fire.position.set(0, 0.7, 0);
  scene.add(hemi, moonLight, fire);

  // Ground: a gently uneven clearing whose edge is lost in the fog.
  const groundGeo = new THREE.PlaneGeometry(70, 70, 50, 50);
  groundGeo.rotateX(-Math.PI / 2);
  const gp = groundGeo.attributes.position;
  for (let i = 0; i < gp.count; i++) {
    const d = Math.hypot(gp.getX(i), gp.getZ(i));
    gp.setY(i, d < 1.4 ? -0.02 : (rand() - 0.5) * 0.12 + Math.min(0.6, Math.max(0, d - 6) * 0.06));
  }
  groundGeo.computeVertexNormals();
  scene.add(new THREE.Mesh(groundGeo, mats.ground));

  // Fire pit: a ring of stones, three logs leaning into a tipi, charred ground in the middle.
  const pit = new THREE.Group();
  const char = new THREE.Mesh(new THREE.CircleGeometry(0.55, 10), mats.char);
  char.rotation.x = -Math.PI / 2;
  char.position.y = 0.01;
  pit.add(char);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14 + rand() * 0.06, 0), mats.stone);
    stone.position.set(Math.cos(a) * 0.68, 0.06, Math.sin(a) * 0.68);
    stone.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    stone.scale.y = 0.7;
    pit.add(stone);
  }
  for (let i = 0; i < 3; i++) {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.95, 6), mats.log);
    const a = (i / 3) * Math.PI * 2 + 0.3;
    log.position.set(Math.cos(a) * 0.24, 0.3, Math.sin(a) * 0.24);
    log.lookAt(0, 0.9, 0);
    log.rotateX(Math.PI / 2);
    pit.add(log);
  }
  scene.add(pit);

  // Flames: three nested cones, each flickering on its own beat.
  const flames = [
    { r: 0.34, h: 0.95, mat: mats.flame, speed: 9 },
    { r: 0.22, h: 0.8, mat: mats.flame, speed: 13 },
    { r: 0.13, h: 0.5, mat: mats.core, speed: 17 },
  ].map(({ r, h, mat, speed }, i) => {
    const geo = new THREE.ConeGeometry(r, h, 7, 1, true);
    geo.translate(0, h / 2, 0);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.12;
    mesh.rotation.y = i;
    scene.add(mesh);
    return { mesh, speed, phase: i * 1.7 };
  });

  // Embers: tiny bright motes that rise, wander and shrink away. Stateless: position is a
  // function of time and each ember's own phase, so a still frame is always valid.
  const emberGeo = new THREE.IcosahedronGeometry(0.025, 0);
  const embers = Array.from({ length: EMBERS }, (_, k) => {
    const mesh = new THREE.Mesh(emberGeo, mats.ember);
    scene.add(mesh);
    return { mesh, offset: k / EMBERS, speed: 0.35 + rand() * 0.25, swirl: rand() * Math.PI * 2 };
  });

  // Smoke: soft grey puffs above the flames, each with its own fading material.
  const smoke = Array.from({ length: SMOKE }, (_, k) => {
    const mat = new THREE.MeshStandardMaterial({ color: '#9aa0ad', transparent: true, depthWrite: false, roughness: 1, flatShading: true });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 1), mat);
    scene.add(mesh);
    return { mesh, mat, offset: k / SMOKE };
  });

  // Tent: a triangular prism with a dark door, angled toward the fire.
  const tent = new THREE.Group();
  const profile = new THREE.Shape();
  profile.moveTo(-0.9, 0);
  profile.lineTo(0.9, 0);
  profile.lineTo(0, 1.25);
  profile.closePath();
  const tentGeo = new THREE.ExtrudeGeometry(profile, { depth: 1.7, bevelEnabled: false });
  tentGeo.translate(0, 0, -0.85);
  tent.add(new THREE.Mesh(tentGeo, mats.tent));
  const doorShape = new THREE.Shape();
  doorShape.moveTo(-0.32, 0);
  doorShape.lineTo(0.32, 0);
  doorShape.lineTo(0, 0.8);
  doorShape.closePath();
  const door = new THREE.Mesh(new THREE.ShapeGeometry(doorShape), mats.door);
  door.position.z = 0.86;
  tent.add(door);
  tent.position.set(-2.4, 0, -1.4);
  tent.rotation.y = 0.75;
  scene.add(tent);

  // Log bench on the other side.
  const bench = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.4, 7), mats.log);
  bench.rotation.set(0, -0.5, Math.PI / 2);
  bench.position.set(1.9, 0.17, 0.5);
  scene.add(bench);

  // Pines around the clearing, kept clear of the tent and the camera's view of the fire.
  const pines: THREE.Vector3[] = [];
  while (pines.length < 18) {
    const a = rand() * Math.PI * 2;
    const r = 4 + rand() * 4;
    const p = new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
    if (p.z > 2.5 && Math.abs(p.x) < 4) continue; // keep the foreground open
    if (pines.some(q => q.distanceTo(p) < 1.1)) continue;
    pines.push(p);
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.6, 5), mats.trunk);
    trunk.position.y = 0.3;
    tree.add(trunk);
    for (let tier = 0; tier < 3; tier++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.75 - tier * 0.18, 1.1, 7), mats.pine);
      cone.position.y = 0.9 + tier * 0.55;
      tree.add(cone);
    }
    tree.position.copy(p);
    tree.scale.setScalar(0.8 + rand() * 0.6);
    tree.rotation.y = rand() * Math.PI;
    scene.add(tree);
  }

  // Fireflies sway along the tree line behind the fire, never toward the camera.
  const fireflyGeo = new THREE.IcosahedronGeometry(0.035, 0);
  const fireflies = Array.from({ length: 10 }, () => {
    const mesh = new THREE.Mesh(fireflyGeo, mats.firefly);
    scene.add(mesh);
    const a = Math.PI * (1.1 + rand() * 0.8);
    return { mesh, a, r: 3 + rand() * 2.5, h: 0.5 + rand() * 1.2, speed: 0.2 + rand() * 0.2, blink: rand() * 6 };
  });

  // Sky: stars on a dome, and a moon.
  const starPos = new Float32Array(260 * 3);
  for (let i = 0; i < 260; i++) {
    const a = rand() * Math.PI * 2;
    const up = 0.08 + rand() * 0.9;
    const v = new THREE.Vector3(Math.cos(a) * Math.cos(up), Math.sin(up), Math.sin(a) * Math.cos(up)).multiplyScalar(40);
    starPos.set([v.x, v.y, v.z], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: '#ffffff', size: 0.16, transparent: true, opacity: 0.85, fog: false });
  scene.add(new THREE.Points(starGeo, starMat));
  const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 2), mats.moon);
  moon.position.set(-12, 11, -26);
  scene.add(moon);

  const flameColor = new THREE.Color(theme.flame);

  return {
    update(t) {
      // Camera drifts in a slow arc, always looking at the fire.
      camera.position.set(Math.sin(t * 0.06) * 1.6, 3 + Math.sin(t * 0.09) * 0.2, 8.4);
      camera.lookAt(0, 0.7, 0);

      // Two incommensurate sines read as an irregular flicker.
      const flicker = 0.5 * Math.sin(t * 11) + 0.3 * Math.sin(t * 17.3 + 1) + 0.2 * Math.sin(t * 5.1);
      fire.intensity = 30 + flicker * 7;
      flames.forEach(({ mesh, speed, phase }) => {
        const f = Math.sin(t * speed + phase) * 0.5 + Math.sin(t * speed * 1.7 + phase * 2) * 0.5;
        mesh.scale.set(1 + f * 0.06, 1 + f * 0.18, 1 + f * 0.06);
        mesh.rotation.y += 0.02;
        mesh.rotation.z = f * 0.05;
      });

      embers.forEach(({ mesh, offset, speed, swirl }) => {
        const p = (t * speed + offset) % 1;
        const a = swirl + t * 1.4 + p * 4;
        mesh.position.set(Math.cos(a) * (0.12 + p * 0.5), 0.5 + p * 2.6, Math.sin(a) * (0.12 + p * 0.5));
        mesh.scale.setScalar(Math.max(0.01, 1.2 * (1 - p)));
      });

      smoke.forEach(({ mesh, mat, offset }) => {
        const p = (t * 0.12 + offset) % 1;
        mesh.position.set(0.15 + p * 1.1, 1.3 + p * 2.8, -p * 0.6);
        mesh.scale.setScalar(0.5 + p * 1.6);
        mat.opacity = 0.16 * Math.sin(p * Math.PI);
      });

      fireflies.forEach(f => {
        const a = f.a + Math.sin(t * f.speed + f.blink) * 0.25;
        f.mesh.position.set(Math.cos(a) * f.r, f.h + Math.sin(t * 0.7 + f.blink) * 0.25, Math.sin(a) * f.r);
        const on = Math.max(0, Math.sin(t * 1.3 + f.blink)) ** 3;
        f.mesh.scale.setScalar(0.2 + on * 1.2);
      });
    },
    setTheme(th) {
      mats.ground.color.set(th.ground);
      mats.pine.color.set(th.pine);
      mats.trunk.color.set(th.trunk);
      mats.tent.color.set(th.tent);
      mats.stone.color.set(th.stone);
      mats.log.color.set(th.log);
      mats.flame.color.set(th.flame);
      mats.core.color.set(th.flameCore);
      mats.ember.color.set(th.flameCore);
      mats.firefly.color.set(th.firefly);
      mats.moon.color.set(th.moon);
      flameColor.set(th.flame);
      fire.color.copy(flameColor);
      hemi.groundColor.set(th.ground);
      (scene.fog as THREE.Fog).color.set(th.skyBottom);
    },
  };
};

/** A campfire in a night clearing, with a tent, pines, embers and fireflies. */
export function Campfire3D(props: ThreeSceneProps<CampfireTheme>) {
  return (
    <ThreeFrame
      {...props}
      defaultTheme={campfireTheme}
      setup={setup}
      // The sky reaches the fog colour just above the horizon, so the fogged ground meets it seamlessly.
      background={t => `linear-gradient(${t.skyTop}, ${t.skyBottom} 17%)`}
    />
  );
}
