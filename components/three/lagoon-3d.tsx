'use client';

// <Lagoon3D>: a sailboat circling a palm-tree island on a low-poly sea. The boat samples
// the same wave function as the water, so it pitches and rolls with the swell. three.js.

import * as THREE from 'three';
import { ThreeFrame, seeded, type SceneSetup, type ThreeSceneProps } from './three-frame';

export const lagoonTheme = {
  skyTop: '#7fb6e0',
  horizon: '#dcebf2',
  water: '#2f86a8',
  sand: '#f0d9a6',
  grass: '#6cbf6a',
  palm: '#3f9d5a',
  trunk: '#9a6b45',
  hull: '#e4573d',
  sail: '#fbf8f1',
  cloud: '#ffffff',
};
export type LagoonTheme = typeof lagoonTheme;

/** Height of the sea at (x, z) and time t. Shared by the water mesh and the boat. */
const waveHeight = (x: number, z: number, t: number) =>
  0.13 * Math.sin(0.55 * x + 1.1 * t) + 0.09 * Math.sin(0.8 * z - 0.8 * t + 1.3) + 0.05 * Math.sin(1.6 * (x + z) + 1.9 * t);

const BOAT_ORBIT = 4.3;

function makeBoat(mats: Record<string, THREE.Material>) {
  const boat = new THREE.Group();
  const outline = new THREE.Shape();
  outline.moveTo(-0.9, -0.32);
  outline.lineTo(0.35, -0.34);
  outline.quadraticCurveTo(0.8, -0.26, 1.05, 0);
  outline.quadraticCurveTo(0.8, 0.26, 0.35, 0.34);
  outline.lineTo(-0.9, 0.32);
  outline.closePath();
  const hullGeo = new THREE.ExtrudeGeometry(outline, { depth: 0.4, bevelEnabled: false, curveSegments: 6 });
  hullGeo.rotateX(Math.PI / 2);
  const p = hullGeo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) * (1 + 0.9 * p.getY(i) / 0.4)); // taper toward the keel
  hullGeo.translate(0, 0.22, 0);
  hullGeo.computeVertexNormals();
  boat.add(new THREE.Mesh(hullGeo, mats.hull));

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.5, 5), mats.trunk);
  mast.position.set(0.15, 0.95, 0);
  boat.add(mast);

  const sail = (points: number[]) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    g.computeVertexNormals();
    return new THREE.Mesh(g, mats.sail);
  };
  boat.add(sail([0.13, 0.35, 0, 0.13, 1.65, 0, -0.75, 0.35, 0]));
  boat.add(sail([0.18, 0.4, 0, 0.18, 1.45, 0, 0.95, 0.35, 0]));
  return boat;
}

function makeGull(mat: THREE.Material) {
  const gull = new THREE.Group();
  // Each wing is a swept triangle hinged at the body.
  const wing = new THREE.BufferGeometry();
  wing.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.07, 0, 0, -0.06, 0.26, 0, -0.1], 3));
  wing.computeVertexNormals();
  const left = new THREE.Mesh(wing, mat);
  const right = new THREE.Mesh(wing, mat);
  right.scale.x = -1;
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.18, 4), mat);
  body.rotation.x = Math.PI / 2;
  gull.add(left, right, body);
  return { gull, left, right };
}

const setup: SceneSetup<LagoonTheme> = ({ scene, camera, theme }) => {
  const rand = seeded(19);
  camera.position.set(0, 6, 13.5);
  camera.lookAt(0, 0.4, 0);
  scene.fog = new THREE.Fog(theme.horizon, 16, 34);

  const flat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8, ...extra });
  const mats = {
    water: flat(theme.water, { roughness: 0.35, metalness: 0.05 }),
    sand: flat(theme.sand),
    grass: flat(theme.grass),
    palm: flat(theme.palm, { side: THREE.DoubleSide }),
    trunk: flat(theme.trunk),
    hull: flat(theme.hull),
    sail: flat(theme.sail, { side: THREE.DoubleSide }),
    cloud: flat(theme.cloud, { roughness: 1 }),
    gull: flat('#ffffff', { side: THREE.DoubleSide }),
  };

  const hemi = new THREE.HemisphereLight('#ffffff', theme.water, 1.4);
  const sun = new THREE.DirectionalLight('#fff4e0', 2.2);
  sun.position.set(-6, 9, 5);
  scene.add(hemi, sun);

  // Sea: a flat-shaded grid whose heights are rewritten each frame.
  const waterGeo = new THREE.PlaneGeometry(60, 60, 72, 72);
  waterGeo.rotateX(-Math.PI / 2);
  const waterPos = waterGeo.attributes.position;
  scene.add(new THREE.Mesh(waterGeo, mats.water));

  // Island: a flattened low-poly dome of sand with a grassy cap and a palm.
  const island = new THREE.Group();
  const sandGeo = new THREE.SphereGeometry(2, 9, 5, 0, Math.PI * 2, 0, Math.PI / 2);
  sandGeo.scale(1, 0.32, 1);
  const grassGeo = new THREE.SphereGeometry(1.35, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
  grassGeo.scale(1, 0.28, 1);
  const grass = new THREE.Mesh(grassGeo, mats.grass);
  grass.position.y = 0.36;
  island.add(new THREE.Mesh(sandGeo, mats.sand), grass);

  const palm = new THREE.Group();
  let tip = new THREE.Vector3(0, 0.45, 0);
  for (let i = 0; i < 6; i++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.07 - i * 0.006, 0.08 - i * 0.006, 0.36, 6), mats.trunk);
    const next = tip.clone().add(new THREE.Vector3(0.05 + i * 0.012, 0.33, 0));
    seg.position.copy(tip).lerp(next, 0.5);
    seg.lookAt(next);
    seg.rotateX(Math.PI / 2);
    palm.add(seg);
    tip = next;
  }
  const fronds = new THREE.Group();
  fronds.position.copy(tip);
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.05, 4, 1, true), mats.palm);
    leaf.scale.set(1, 1, 0.25);
    leaf.position.y = 0.42;
    const arm = new THREE.Group();
    arm.rotation.set(1.05 + (i % 2) * 0.2, (i / 7) * Math.PI * 2, 0, 'YXZ');
    arm.add(leaf);
    fronds.add(arm);
  }
  palm.add(fronds);
  palm.position.set(-0.3, 0, 0.1);
  island.add(palm);
  scene.add(island);

  const boat = makeBoat(mats);
  scene.add(boat);

  const gulls = Array.from({ length: 3 }, (_, i) => {
    const g = makeGull(mats.gull);
    scene.add(g.gull);
    return { ...g, radius: 2.5 + i * 0.9, height: 3.6 + i * 0.5, speed: 0.35 + rand() * 0.2, phase: rand() * 6 };
  });

  const clouds = Array.from({ length: 5 }, () => {
    const cloud = new THREE.Group();
    const puffs = 3 + Math.floor(rand() * 3);
    for (let p = 0; p < puffs; p++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 + rand() * 0.4, 1), mats.cloud);
      puff.position.set((p - puffs / 2) * 0.6, rand() * 0.25, (rand() - 0.5) * 0.4);
      cloud.add(puff);
    }
    cloud.position.set((rand() - 0.5) * 30, 3.6 + rand() * 1.6, -10 - rand() * 6);
    scene.add(cloud);
    return { cloud, speed: 0.25 + rand() * 0.25, start: cloud.position.x };
  });

  let pitch = 0;
  let roll = 0;

  return {
    update(t) {
      for (let i = 0; i < waterPos.count; i++) {
        waterPos.setY(i, waveHeight(waterPos.getX(i), waterPos.getZ(i), t));
      }
      waterPos.needsUpdate = true;
      waterGeo.computeVertexNormals();

      // Boat circles the island, heading along its path and riding the swell.
      const angle = -t * 0.14;
      const x = Math.cos(angle) * BOAT_ORBIT;
      const z = Math.sin(angle) * BOAT_ORBIT;
      const heading = Math.atan2(Math.cos(angle), -Math.sin(angle)) - Math.PI / 2;
      const ahead = new THREE.Vector2(Math.sin(angle), -Math.cos(angle));
      const side = new THREE.Vector2(Math.cos(angle), Math.sin(angle));
      const h = waveHeight(x, z, t);
      const hBow = waveHeight(x + ahead.x * 0.9, z + ahead.y * 0.9, t);
      const hStern = waveHeight(x - ahead.x * 0.9, z - ahead.y * 0.9, t);
      const hPort = waveHeight(x + side.x * 0.35, z + side.y * 0.35, t);
      const hStar = waveHeight(x - side.x * 0.35, z - side.y * 0.35, t);
      pitch += (Math.atan2(hBow - hStern, 1.8) - pitch) * 0.1;
      roll += (Math.atan2(hPort - hStar, 0.7) - roll) * 0.1;
      boat.position.set(x, h - 0.06, z);
      boat.rotation.set(0, heading, 0);
      boat.rotateZ(pitch);
      boat.rotateX(roll);

      fronds.rotation.z = Math.sin(t * 1.3) * 0.05;

      gulls.forEach(g => {
        const a = t * g.speed + g.phase;
        g.gull.position.set(Math.cos(a) * g.radius, g.height + Math.sin(t * 0.9 + g.phase) * 0.2, Math.sin(a) * g.radius);
        g.gull.rotation.y = -a;
        const flap = 0.25 + Math.sin(t * 7 + g.phase) * 0.5; // V-shaped glide with flaps
        g.left.rotation.z = flap;
        g.right.rotation.z = -flap;
      });

      clouds.forEach(c => {
        c.cloud.position.x = ((c.start + t * c.speed + 20) % 40) - 20;
      });
    },
    setTheme(th) {
      mats.water.color.set(th.water);
      mats.sand.color.set(th.sand);
      mats.grass.color.set(th.grass);
      mats.palm.color.set(th.palm);
      mats.trunk.color.set(th.trunk);
      mats.hull.color.set(th.hull);
      mats.sail.color.set(th.sail);
      mats.cloud.color.set(th.cloud);
      hemi.groundColor.set(th.water);
      (scene.fog as THREE.Fog).color.set(th.horizon);
    },
  };
};

/** A sailboat circling a palm-tree island on a low-poly sea. */
export function Lagoon3D(props: ThreeSceneProps<LagoonTheme>) {
  return (
    <ThreeFrame
      {...props}
      defaultTheme={lagoonTheme}
      setup={setup}
      background={t => `linear-gradient(${t.skyTop}, ${t.horizon} 62%)`}
    />
  );
}
