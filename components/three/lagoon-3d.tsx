'use client';

// <Lagoon3D>: a sailboat circling a palm-tree island on a low-poly sea. The boat steers along
// its circle, and samples the same wave function as the water so it pitches and rolls with the
// swell, leaving a fading wake. Gulls wheel overhead and foam breathes around the shore. three.js.

import * as THREE from 'three';
import { ThreeFrame, seeded, type SceneSetup, type ThreeSceneProps } from './three-frame';

export const lagoonTheme = {
  skyTop: '#7fb6e0',
  horizon: '#dcebf2',
  water: '#2f86a8',
  foam: '#f4fbff',
  sand: '#f0d9a6',
  grass: '#6cbf6a',
  palm: '#3f9d5a',
  trunk: '#9a6b45',
  rock: '#8f9aa3',
  hull: '#e4573d',
  sail: '#fbf8f1',
};
export type LagoonTheme = typeof lagoonTheme;

/** Height of the sea at (x, z) and time t. Shared by the water mesh, the boat, its wake and the foam. */
const waveHeight = (x: number, z: number, t: number) =>
  0.13 * Math.sin(0.55 * x + 1.1 * t) + 0.09 * Math.sin(0.8 * z - 0.8 * t + 1.3) + 0.05 * Math.sin(1.6 * (x + z) + 1.9 * t);

const BOAT_ORBIT = 4.3;
/** Radians per second around the island (negative: clockwise seen from above). */
const BOAT_SPEED = -0.14;
const WAKE_PUFFS = 28;
/** Seconds between wake puffs; the wake is a pure function of time, so it needs no state. */
const WAKE_STEP = 0.22;

/** The boat's position and heading at time t. Its bow (local +x) points along its path. */
function boatPose(t: number) {
  const a = BOAT_SPEED * t;
  const x = Math.cos(a) * BOAT_ORBIT;
  const z = Math.sin(a) * BOAT_ORBIT;
  // Velocity points along (-sin a, cos a) × BOAT_SPEED; rotation.y = h aims local +x at (cos h, -sin h).
  const dir = Math.sign(BOAT_SPEED);
  const fx = -Math.sin(a) * dir;
  const fz = Math.cos(a) * dir;
  return { x, z, fx, fz, heading: Math.atan2(-fz, fx) };
}

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

  // Deck and a small cabin.
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.5), mats.trunk);
  deck.position.set(-0.1, 0.24, 0);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.36), mats.sail);
  cabin.position.set(-0.45, 0.34, 0);
  boat.add(deck, cabin);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.5, 5), mats.trunk);
  mast.position.set(0.15, 0.95, 0);
  boat.add(mast);

  // Sails bellied slightly to one side, so they read as cloth catching the wind.
  const sail = (points: [number, number][], belly: number) => {
    const [a, b, c] = points;
    const mid = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
    const v = [...a, 0, ...b, 0, ...mid, belly, ...b, 0, ...c, 0, ...mid, belly, ...c, 0, ...a, 0, ...mid, belly];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.computeVertexNormals();
    return new THREE.Mesh(g, mats.sail);
  };
  boat.add(sail([[0.13, 0.4], [0.13, 1.65], [-0.75, 0.42]], 0.14));
  boat.add(sail([[0.19, 0.45], [0.19, 1.45], [0.95, 0.38]], 0.1));

  const flag = new THREE.Mesh(new THREE.BufferGeometry(), mats.hull);
  // Built around its hinge on the mast, so it can flutter about the mast.
  flag.geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0.06, 0, 0, -0.06, 0, -0.27, 0, 0], 3));
  flag.geometry.computeVertexNormals();
  flag.position.set(0.15, 1.64, 0);
  boat.add(flag);
  return { boat, flag };
}

/** A palm: a curved, segmented trunk with drooping fronds. Returns the fronds so they can sway. */
function makePalm(mats: Record<string, THREE.Material>, height: number, lean: number) {
  const palm = new THREE.Group();
  let tip = new THREE.Vector3(0, 0, 0);
  const segments = Math.round(height / 0.33);
  for (let i = 0; i < segments; i++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.07 - i * 0.006, 0.08 - i * 0.006, 0.36, 6), mats.trunk);
    const next = tip.clone().add(new THREE.Vector3(lean * (0.05 + i * 0.012), 0.33, 0));
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
  const coconuts = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 0), mats.trunk);
  coconuts.position.set(0.04, -0.06, 0.04);
  fronds.add(coconuts);
  palm.add(fronds);
  return { palm, fronds };
}

/** A gull: a body and two wings hinged at the shoulder. */
function makeGull(mat: THREE.Material) {
  const gull = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.3, 4), mat);
  body.rotation.z = -Math.PI / 2;
  gull.add(body);
  const wings: THREE.Object3D[] = [];
  for (const side of [1, -1]) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([0.06, 0, 0, -0.06, 0, 0, -0.02, 0, side * 0.32], 3));
    g.computeVertexNormals();
    const wing = new THREE.Group();
    wing.add(new THREE.Mesh(g, mat));
    wing.userData.side = side;
    wings.push(wing);
    gull.add(wing);
  }
  return { gull, wings };
}

const setup: SceneSetup<LagoonTheme> = ({ scene, camera, theme }) => {
  const rand = seeded(11);
  camera.position.set(0, 6, 13.5);
  camera.lookAt(0, 0.6, -1.2);
  scene.fog = new THREE.Fog(theme.horizon, 16, 34);

  const flat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8, ...extra });
  const mats = {
    water: flat(theme.water, { roughness: 0.35, metalness: 0.05 }),
    sand: flat(theme.sand),
    grass: flat(theme.grass),
    palm: flat(theme.palm, { side: THREE.DoubleSide }),
    trunk: flat(theme.trunk),
    rock: flat(theme.rock),
    hull: flat(theme.hull, { side: THREE.DoubleSide }),
    // A little self-light so the back of the sail and the gulls never turn grey.
    sail: flat(theme.sail, { side: THREE.DoubleSide, emissive: theme.sail, emissiveIntensity: 0.35 }),
    gull: flat('#ffffff', { side: THREE.DoubleSide, emissive: '#ffffff', emissiveIntensity: 0.4 }),
    foam: new THREE.MeshBasicMaterial({ color: theme.foam, transparent: true, opacity: 0.55, depthWrite: false }),
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
  // A static plane beyond it carries the sea to the horizon, so the grid's edge never shows.
  const farSea = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), mats.water);
  farSea.rotation.x = -Math.PI / 2;
  farSea.position.y = -0.3;
  scene.add(farSea);

  // Island: a flattened low-poly dome of sand with a grassy cap, two palms, rocks and a little jetty.
  const island = new THREE.Group();
  const sandGeo = new THREE.SphereGeometry(2, 9, 5, 0, Math.PI * 2, 0, Math.PI / 2);
  sandGeo.scale(1, 0.32, 1);
  const grassGeo = new THREE.SphereGeometry(1.35, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
  grassGeo.scale(1, 0.28, 1);
  const grass = new THREE.Mesh(grassGeo, mats.grass);
  grass.position.set(-0.15, 0.36, -0.1);
  island.add(new THREE.Mesh(sandGeo, mats.sand), grass);

  const tall = makePalm(mats, 2, 1);
  tall.palm.position.set(-0.3, 0.45, 0.1);
  const short = makePalm(mats, 1.3, -1);
  short.palm.position.set(0.55, 0.42, -0.45);
  short.palm.rotation.y = 0.6;
  island.add(tall.palm, short.palm);

  // Bushes on the grass.
  [[-0.9, 0.42, -0.3, 0.22], [0.2, 0.46, 0.55, 0.17], [0.9, 0.38, 0.2, 0.14]].forEach(([x, y, z, r]) => {
    const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), mats.palm);
    bush.position.set(x, y, z);
    island.add(bush);
  });

  // Rocks around the shore, half sunk in the sand or the sea.
  for (let i = 0; i < 6; i++) {
    const a = rand() * Math.PI * 2;
    const r = 1.75 + rand() * 0.5;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12 + rand() * 0.14, 0), mats.rock);
    rock.position.set(Math.cos(a) * r, 0.02, Math.sin(a) * r);
    rock.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    rock.scale.y = 0.7;
    island.add(rock);
  }

  // Jetty: planks on posts, reaching out toward the boat's circle.
  const jetty = new THREE.Group();
  const planks = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.36), mats.trunk);
  planks.position.set(0.45, 0.28, 0);
  jetty.add(planks);
  for (const x of [0.05, 0.6, 1.05]) {
    for (const z of [-0.15, 0.15]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 5), mats.trunk);
      post.position.set(x, 0.02, z);
      jetty.add(post);
    }
  }
  jetty.position.set(1.7, 0, 0.9);
  jetty.rotation.y = -0.5;
  island.add(jetty);
  scene.add(island);

  // Foam: a ring hugging the shore that rides the swell and breathes in and out.
  const foamGeo = new THREE.RingGeometry(1.92, 2.1, 32, 1);
  foamGeo.rotateX(-Math.PI / 2);
  const foamPos = foamGeo.attributes.position;
  // Ragged outer edge: push each outer vertex out by a seeded amount.
  for (let i = 0; i < foamPos.count; i++) {
    const r = Math.hypot(foamPos.getX(i), foamPos.getZ(i));
    if (r > 2) {
      const k = 1 + rand() * 0.07;
      foamPos.setXYZ(i, foamPos.getX(i) * k, 0, foamPos.getZ(i) * k);
    }
  }
  const shoreFoam = new THREE.Mesh(foamGeo, mats.foam);
  scene.add(shoreFoam);

  const { boat, flag } = makeBoat(mats);
  scene.add(boat);

  // Wake: flat discs dropped at the stern every WAKE_STEP seconds. Each spreads and fades as it ages.
  const wakeGeo = new THREE.CircleGeometry(0.14, 7);
  wakeGeo.rotateX(-Math.PI / 2);
  const wake = Array.from({ length: WAKE_PUFFS }, (_, i) => {
    const mat = mats.foam.clone();
    const mesh = new THREE.Mesh(wakeGeo, mat);
    mesh.userData.side = i % 2 ? 1 : -1;
    scene.add(mesh);
    return { mesh, mat };
  });

  // Gulls wheel around the island on tilted circles.
  const gulls = [0, 1, 2].map(i => {
    const g = makeGull(mats.gull);
    const pivot = new THREE.Object3D();
    pivot.position.y = 3 + i * 0.5;
    pivot.rotation.x = 0.12 * (i - 1);
    g.gull.position.x = 2.2 + i * 0.7;
    g.gull.rotation.y = Math.PI / 2; // beak along the direction of travel
    pivot.add(g.gull);
    scene.add(pivot);
    return { ...g, pivot, speed: 0.35 + i * 0.07, phase: i * 2.1 };
  });

  let pitch = 0;
  let roll = 0;
  let lastT = -1;

  return {
    update(t) {
      for (let i = 0; i < waterPos.count; i++) {
        waterPos.setY(i, waveHeight(waterPos.getX(i), waterPos.getZ(i), t));
      }
      waterPos.needsUpdate = true;
      waterGeo.computeVertexNormals();

      // Boat: steer along the circle, then pitch and roll to match the sea under bow, stern and sides.
      const { x, z, fx, fz, heading } = boatPose(t);
      // Local +z after the heading turn, i.e. the boat's right-hand side seen from above.
      const sx = -fz;
      const sz = fx;
      const h = waveHeight(x, z, t);
      const hBow = waveHeight(x + fx * 0.9, z + fz * 0.9, t);
      const hStern = waveHeight(x - fx * 0.9, z - fz * 0.9, t);
      const hRight = waveHeight(x + sx * 0.35, z + sz * 0.35, t);
      const hLeft = waveHeight(x - sx * 0.35, z - sz * 0.35, t);
      const targetPitch = Math.atan2(hBow - hStern, 1.8);
      // rotateX(+θ) lowers local +z, so a higher right side needs a negative angle. The small
      // constant is the heel of a boat leaning into its turn.
      const targetRoll = Math.atan2(hLeft - hRight, 0.7) + 0.07 * Math.sign(BOAT_SPEED);
      // Ease toward the targets, but jump straight there after a seek (reduced motion, first frame).
      const ease = lastT < 0 || Math.abs(t - lastT) > 0.5 ? 1 : 0.1;
      pitch += (targetPitch - pitch) * ease;
      roll += (targetRoll - roll) * ease;
      lastT = t;
      boat.position.set(x, h - 0.06, z);
      boat.rotation.set(0, 0, 0);
      boat.rotateY(heading);
      boat.rotateZ(pitch);
      boat.rotateX(roll);
      flag.rotation.y = Math.sin(t * 7) * 0.3;

      // Wake: puff k was dropped at the stern k steps ago, then drifts outward from the track.
      const newest = Math.floor(t / WAKE_STEP);
      wake.forEach(({ mesh, mat }, k) => {
        const born = (newest - Math.floor(k / 2)) * WAKE_STEP;
        const age = t - born;
        const life = age / ((WAKE_PUFFS / 2) * WAKE_STEP);
        const p = boatPose(born);
        const spread = 0.1 + age * 0.22;
        const px = p.x - p.fx * 0.85 + -p.fz * spread * mesh.userData.side;
        const pz = p.z - p.fz * 0.85 + p.fx * spread * mesh.userData.side;
        mesh.position.set(px, waveHeight(px, pz, t) + 0.03, pz);
        mesh.scale.setScalar(0.6 + life * 1.6);
        mat.opacity = born < 0 ? 0 : 0.6 * (1 - life) ** 1.5;
      });

      const breath = 1 + 0.04 * Math.sin(t * 1.1);
      shoreFoam.scale.set(breath, 1, breath);
      for (let i = 0; i < foamPos.count; i++) {
        foamPos.setY(i, waveHeight(foamPos.getX(i) * breath, foamPos.getZ(i) * breath, t) + 0.015);
      }
      foamPos.needsUpdate = true;
      mats.foam.opacity = 0.32 + 0.12 * Math.sin(t * 1.1 + 1);

      tall.fronds.rotation.z = Math.sin(t * 1.3) * 0.05;
      short.fronds.rotation.z = Math.sin(t * 1.1 + 1) * 0.06;

      gulls.forEach(g => {
        g.pivot.rotation.y = g.phase + t * g.speed;
        g.gull.position.y = Math.sin(t * 0.8 + g.phase) * 0.15;
        const flap = Math.sin(t * 5 + g.phase);
        // Flap in bursts, then glide.
        const amount = Math.max(0, Math.sin(t * 0.7 + g.phase)) * 0.6;
        g.wings.forEach(w => (w.rotation.x = -w.userData.side * (0.15 + flap * amount)));
      });
    },
    setTheme(th) {
      mats.water.color.set(th.water);
      mats.sand.color.set(th.sand);
      mats.grass.color.set(th.grass);
      mats.palm.color.set(th.palm);
      mats.trunk.color.set(th.trunk);
      mats.rock.color.set(th.rock);
      mats.hull.color.set(th.hull);
      mats.sail.color.set(th.sail);
      mats.sail.emissive.set(th.sail);
      mats.foam.color.set(th.foam);
      wake.forEach(w => w.mat.color.set(th.foam));
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
