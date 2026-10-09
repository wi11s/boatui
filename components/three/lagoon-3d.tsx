'use client';

// <Lagoon3D>: a sailboat circling a palm-tree island on a low-poly sea. The boat samples
// the same wave function as the water, so it pitches and rolls with the swell. three.js.

import * as THREE from 'three';
import { ThreeFrame, type SceneSetup, type ThreeSceneProps } from './three-frame';

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

const setup: SceneSetup<LagoonTheme> = ({ scene, camera, theme }) => {
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
    // A little self-light so the back of the sail never turns grey.
    sail: flat(theme.sail, { side: THREE.DoubleSide, emissive: theme.sail, emissiveIntensity: 0.35 }),
  };

  const hemi = new THREE.HemisphereLight('#ffffff', theme.water, 1.4);
  const sun = new THREE.DirectionalLight('#fff4e0', 2.2);
  sun.position.set(-6, 9, 5);
  scene.add(hemi, sun);

  // Sea: a flat-shaded grid whose heights are rewritten each frame.
  // Large enough that its edge is always lost in the fog.
  const waterGeo = new THREE.PlaneGeometry(110, 110, 90, 90);
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

    },
    setTheme(th) {
      mats.water.color.set(th.water);
      mats.sand.color.set(th.sand);
      mats.grass.color.set(th.grass);
      mats.palm.color.set(th.palm);
      mats.trunk.color.set(th.trunk);
      mats.hull.color.set(th.hull);
      mats.sail.color.set(th.sail);
      mats.sail.emissive.set(th.sail);
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
      background={t => `linear-gradient(${t.skyTop}, ${t.horizon} 24%)`}
    />
  );
}
