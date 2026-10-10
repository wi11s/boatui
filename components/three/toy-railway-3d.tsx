'use client';

// <ToyRailway3D>: a toy railway on a diorama board. A little steam train with two carriages runs
// round an oval track, through a tunnel in a hill and past a station, where it slows almost to a
// stop each lap. Smoke puffs trail behind it and the crossing gate lowers as it comes. three.js.

import * as THREE from 'three';
import { ThreeFrame, seeded, type SceneSetup, type ThreeSceneProps } from './three-frame';

export const toyRailwayTheme = {
  backdrop: '#f6ead8',
  backdropEdge: '#e2c9a8',
  board: '#a8744c',
  grass: '#8cc66a',
  hill: '#74b35a',
  rail: '#8a8f99',
  sleeper: '#7a5236',
  engine: '#e4573d',
  carriage1: '#3f86c9',
  carriage2: '#f2b84a',
  trim: '#2b2b33',
  roof: '#c2442e',
  wall: '#fbf3e4',
  tree: '#4f9a52',
  water: '#6fb7e0',
  smoke: '#ffffff',
};
export type ToyRailwayTheme = typeof toyRailwayTheme;

// Oval track: x = A cos θ, z = B sin θ. The station is at θ = 0 (right), the tunnel at the back.
const A = 2.8;
const B = 1.7;
const RAIL_GAUGE = 0.11;
const LAP = 22; // seconds per lap
const CAR_GAP = 0.78;
const SMOKE = 9;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Arc-length lookup for the oval, so the train and carriages keep their spacing all the way round. */
function makeTrack() {
  const N = 720;
  const lengths = new Float32Array(N + 1);
  let total = 0;
  for (let i = 1; i <= N; i++) {
    const a = ((i - 1) / N) * Math.PI * 2;
    const b = (i / N) * Math.PI * 2;
    total += Math.hypot(A * (Math.cos(b) - Math.cos(a)), B * (Math.sin(b) - Math.sin(a)));
    lengths[i] = total;
  }
  /** Position and heading at distance s along the track (wraps). rotation.y = heading aims local +x forward. */
  const at = (s: number) => {
    const u = (((s % total) + total) % total);
    let lo = 0;
    let hi = N;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (lengths[mid] < u) lo = mid;
      else hi = mid;
    }
    const f = (u - lengths[lo]) / (lengths[hi] - lengths[lo] || 1);
    const th = ((lo + f) / N) * Math.PI * 2;
    const x = A * Math.cos(th);
    const z = B * Math.sin(th);
    const dx = -A * Math.sin(th);
    const dz = B * Math.cos(th);
    return { x, z, heading: Math.atan2(-dz, dx), th };
  };
  return { total, at };
}

/** Distance travelled by the front of the train: it eases nearly to a stop at the station each lap. */
const travelled = (t: number, total: number) => {
  const w = (Math.PI * 2) / LAP;
  return ((w * t - 0.8 * Math.sin(w * t)) / (Math.PI * 2)) * total;
};

const setup: SceneSetup<ToyRailwayTheme> = ({ scene, camera, theme }) => {
  const rand = seeded(5);
  const track = makeTrack();

  const flat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...extra });
  const mats = {
    board: flat(theme.board),
    grass: flat(theme.grass),
    hill: flat(theme.hill),
    rail: flat(theme.rail, { metalness: 0.4, roughness: 0.5 }),
    sleeper: flat(theme.sleeper),
    engine: flat(theme.engine, { roughness: 0.5 }),
    carriage1: flat(theme.carriage1, { roughness: 0.5 }),
    carriage2: flat(theme.carriage2, { roughness: 0.5 }),
    trim: flat(theme.trim),
    roof: flat(theme.roof),
    wall: flat(theme.wall),
    tree: flat(theme.tree),
    trunk: flat('#7a5236'),
    water: flat(theme.water, { roughness: 0.2 }),
    tunnel: new THREE.MeshBasicMaterial({ color: '#1d1a22' }),
    stone: flat('#b9b2a8'),
    window: flat('#ffe8a8'),
    stripe: flat('#ffffff'),
  };

  const hemi = new THREE.HemisphereLight('#fff6ea', theme.board, 1.1);
  const sun = new THREE.DirectionalLight('#fff1dc', 1.7);
  sun.position.set(-4, 7, 5);
  scene.add(hemi, sun);

  // The board: a grassy oval slab with wooden sides.
  const boardGeo = new THREE.CylinderGeometry(1, 1, 0.35, 56);
  boardGeo.scale(4.4, 1, 3.4);
  const board = new THREE.Mesh(boardGeo, [mats.board, mats.grass, mats.board]);
  board.position.y = -0.175;
  scene.add(board);

  // Rails: two tubes along the oval, offset to either side of the centre line.
  const railCurve = (offset: number) =>
    new THREE.CatmullRomCurve3(
      Array.from({ length: 160 }, (_, i) => {
        const th = (i / 160) * Math.PI * 2;
        // Outward normal of the ellipse at θ.
        const nx = B * Math.cos(th);
        const nz = A * Math.sin(th);
        const len = Math.hypot(nx, nz);
        return new THREE.Vector3(A * Math.cos(th) + (nx / len) * offset, 0.06, B * Math.sin(th) + (nz / len) * offset);
      }),
      true,
    );
  for (const side of [-1, 1]) {
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(railCurve(side * RAIL_GAUGE), 240, 0.018, 4, true), mats.rail));
  }
  const sleeperGeo = new THREE.BoxGeometry(0.07, 0.03, 0.34);
  for (let s = 0; s < track.total; s += 0.2) {
    const p = track.at(s);
    const sleeper = new THREE.Mesh(sleeperGeo, mats.sleeper);
    sleeper.position.set(p.x, 0.02, p.z);
    sleeper.rotation.y = p.heading;
    scene.add(sleeper);
  }

  // Hill with a tunnel: a stepped mound at the back that the track runs straight through, with a
  // stone arch and a dark mouth at each end.
  const hillProfile = [
    [1.55, 0],
    [1.5, 0.62],
    [1.2, 0.95],
    [0.7, 1.2],
    [0, 1.28],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const hillGeo = new THREE.LatheGeometry(hillProfile, 12);
  hillGeo.scale(1.25, 1, 0.9);
  const hill = new THREE.Mesh(hillGeo, mats.hill);
  hill.position.set(0, 0, -B);
  scene.add(hill);
  // A tunnel mouth where the track meets the hill's wall on each side, facing along the track.
  const hillR = (x: number, z: number) => Math.hypot(x / 1.25, (z + B) / 0.9);
  for (const side of [-1, 1]) {
    let th = Math.PI / 2;
    while (hillR(A * Math.cos(th), -B * Math.sin(th)) < 1.5) th -= side * 0.002;
    const x = A * Math.cos(th);
    const z = -B * Math.sin(th);
    // Track direction there (moving toward +x along the back), flipped to point out of the hill.
    const nx = side * A * Math.sin(th);
    const nz = side * B * Math.cos(th);
    const portal = new THREE.Group();
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.3, 12, 0, Math.PI), mats.tunnel);
    mouth.scale.y = 1.9;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.06, 4, 12, Math.PI), mats.stone);
    arch.scale.y = 1.8;
    portal.add(mouth, arch);
    portal.position.set(x, 0, z);
    portal.rotation.y = Math.atan2(nx, nz);
    scene.add(portal);
  }

  // Station on the right, where the train slows: a platform, a little building and a lamp.
  const station = new THREE.Group();
  const platform = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 1.5), mats.stone);
  platform.position.set(0.42, 0.06, 0);
  station.add(platform);
  const house = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.7), mats.wall);
  house.position.set(0.95, 0.21, 0);
  station.add(house);
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-0.3, 0);
  roofShape.lineTo(0.3, 0);
  roofShape.lineTo(0, 0.26);
  roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 0.84, bevelEnabled: false });
  roofGeo.translate(0, 0.42, -0.42);
  const roof = new THREE.Mesh(roofGeo, mats.roof);
  roof.position.x = 0.95;
  station.add(roof);
  for (const z of [-0.18, 0.18]) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.12), mats.window);
    pane.position.set(0.735, 0.25, z);
    pane.rotation.y = -Math.PI / 2;
    station.add(pane);
  }
  const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 4), mats.trim);
  lampPost.position.set(0.5, 0.37, 0.6);
  const lamp = new THREE.Mesh(new THREE.IcosahedronGeometry(0.045, 0), mats.window);
  lamp.position.set(0.5, 0.63, 0.6);
  station.add(lampPost, lamp);
  station.position.x = A;
  scene.add(station);

  // Level crossing at the front: a road across the track and a striped gate arm.
  const road = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.01, 2.2), flat('#c9c3b8'));
  road.position.set(0.9, 0.005, B + 0.2);
  scene.add(road);
  // A cottage at the inner end of the road.
  const cottage = new THREE.Group();
  const cottageWalls = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.4), mats.wall);
  cottageWalls.position.y = 0.16;
  const cottageRoofShape = new THREE.Shape();
  cottageRoofShape.moveTo(-0.3, 0);
  cottageRoofShape.lineTo(0.3, 0);
  cottageRoofShape.lineTo(0, 0.24);
  cottageRoofShape.closePath();
  const cottageRoofGeo = new THREE.ExtrudeGeometry(cottageRoofShape, { depth: 0.5, bevelEnabled: false });
  cottageRoofGeo.translate(0, 0.32, -0.25);
  cottageRoofGeo.rotateY(Math.PI / 2);
  const cottageDoor = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.16), mats.trim);
  cottageDoor.position.set(0, 0.08, 0.202);
  cottage.add(cottageWalls, new THREE.Mesh(cottageRoofGeo, mats.roof), cottageDoor);
  cottage.position.set(0.9, 0, B - 1.15);
  scene.add(cottage);
  const gatePivot = new THREE.Group();
  const gatePost = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.06), mats.trim);
  gatePost.position.y = 0.14;
  const arm = new THREE.Group();
  for (let k = 0; k < 4; k++) {
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.04), k % 2 ? mats.engine : mats.stripe);
    seg.position.x = 0.08 + k * 0.15;
    arm.add(seg);
  }
  arm.position.y = 0.26;
  gatePivot.add(gatePost, arm);
  gatePivot.position.set(0.55, 0, B + 0.42);
  scene.add(gatePivot);
  const crossingS = (() => {
    // Distance along the track of the crossing (front straight, x ≈ 0.9).
    let best = 0;
    let bestD = Infinity;
    for (let s = 0; s < track.total; s += 0.01) {
      const p = track.at(s);
      const d = Math.hypot(p.x - 0.9, p.z - B);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    return best;
  })();

  // Infield: a little pond with reeds, and trees dotted around, kept off the track and the hill.
  const pond = new THREE.Mesh(new THREE.CircleGeometry(0.55, 14), mats.water);
  pond.rotation.x = -Math.PI / 2;
  pond.scale.set(1.3, 0.9, 1);
  pond.position.set(-0.6, 0.012, 0.35);
  scene.add(pond);
  const offTrack = (x: number, z: number) => {
    const e = Math.hypot(x / A, z / B);
    return Math.abs(e - 1) * Math.min(A, B) > 0.42;
  };
  const trees: THREE.Vector3[] = [];
  while (trees.length < 16) {
    const x = (rand() - 0.5) * 8;
    const z = (rand() - 0.5) * 6;
    if ((x / 4.1) ** 2 + (z / 3.1) ** 2 > 1) continue;
    if (!offTrack(x, z)) continue;
    if (Math.hypot(x / 1.25, (z + B) / 0.9) < 1.8) continue; // the hill
    if (Math.hypot(x + 0.6, z - 0.35) < 0.9) continue; // the pond
    if (x > A - 0.2 && Math.abs(z) < 0.9) continue; // the station
    if (Math.abs(x - 0.9) < 0.5 && z > B - 1.5) continue; // the road and cottage
    const p = new THREE.Vector3(x, 0, z);
    if (trees.some(q => q.distanceTo(p) < 0.55)) continue;
    trees.push(p);
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.22, 5), mats.trunk);
    trunk.position.y = 0.11;
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 0), mats.tree);
    crown.position.y = 0.36;
    crown.scale.y = 1.25;
    tree.add(trunk, crown);
    tree.position.copy(p);
    tree.scale.setScalar(0.8 + rand() * 0.5);
    tree.rotation.y = rand() * Math.PI;
    scene.add(tree);
  }

  // A few trees on top of the hill.
  const hillHeight = (r: number) => {
    for (let i = 1; i < hillProfile.length; i++) {
      const [p, q] = [hillProfile[i - 1], hillProfile[i]];
      if (r >= q.x) return p.y + ((q.y - p.y) * (p.x - r)) / (p.x - q.x);
    }
    return hillProfile[hillProfile.length - 1].y;
  };
  for (const [x, z, sc] of [
    [-0.6, -B + 0.4, 1],
    [0.5, -B + 0.3, 0.85],
    [-0.05, -B + 0.72, 0.75],
  ]) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.22, 5), mats.trunk);
    trunk.position.y = 0.11;
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 0), mats.tree);
    crown.position.y = 0.36;
    crown.scale.y = 1.25;
    tree.add(trunk, crown);
    tree.position.set(x, hillHeight(hillR(x, z)) - 0.02, z);
    tree.scale.setScalar(sc);
    scene.add(tree);
  }

  // The train. Each vehicle's origin is its centre at rail height, nose along local +x.
  const wheelGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.04, 10);
  wheelGeo.rotateX(Math.PI / 2);
  const addWheels = (group: THREE.Group, xs: number[]) => {
    for (const x of xs) {
      for (const z of [-0.13, 0.13]) {
        const wheel = new THREE.Mesh(wheelGeo, mats.trim);
        wheel.position.set(x, 0.1, z);
        group.add(wheel);
      }
    }
  };
  const engine = new THREE.Group();
  const boilerGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.42, 12);
  boilerGeo.rotateZ(Math.PI / 2);
  const boiler = new THREE.Mesh(boilerGeo, mats.engine);
  boiler.position.set(0.1, 0.28, 0);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.3), mats.engine);
  cab.position.set(-0.2, 0.33, 0);
  const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.34), mats.trim);
  cabRoof.position.set(-0.2, 0.5, 0);
  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.16, 8), mats.trim);
  chimney.position.set(0.23, 0.46, 0);
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.06, 0.28), mats.trim);
  chassis.position.set(0, 0.15, 0);
  const lampFront = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035, 0), mats.window);
  lampFront.position.set(0.32, 0.3, 0);
  const cabWindow = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.1), mats.window);
  cabWindow.position.set(-0.2, 0.38, 0.152);
  const cabWindow2 = cabWindow.clone();
  cabWindow2.position.z = -0.152;
  cabWindow2.rotation.y = Math.PI;
  engine.add(boiler, cab, cabRoof, chimney, chassis, lampFront, cabWindow, cabWindow2);
  addWheels(engine, [-0.2, 0.02, 0.2]);
  scene.add(engine);

  const carriages = [mats.carriage1, mats.carriage2].map(mat => {
    const car = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 0.3), mat);
    body.position.y = 0.31;
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.04, 0.33), mats.trim);
    top.position.y = 0.47;
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.26), mats.trim);
    base.position.y = 0.15;
    car.add(body, top, base);
    for (const z of [0.152, -0.152]) {
      for (const x of [-0.18, 0, 0.18]) {
        const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), mats.window);
        pane.position.set(x, 0.35, z);
        if (z < 0) pane.rotation.y = Math.PI;
        car.add(pane);
      }
    }
    addWheels(car, [-0.18, 0.18]);
    scene.add(car);
    return car;
  });

  // Smoke: puffs left behind at the chimney's past positions, rising and fading with age.
  const smoke = Array.from({ length: SMOKE }, () => {
    const mat = new THREE.MeshStandardMaterial({ color: theme.smoke, transparent: true, depthWrite: false, flatShading: true });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 0), mat);
    scene.add(mesh);
    return { mesh, mat };
  });
  const PUFF_STEP = 0.32;

  const place = (obj: THREE.Object3D, s: number) => {
    const p = track.at(s);
    obj.position.set(p.x, 0.04, p.z);
    obj.rotation.y = p.heading;
  };

  return {
    update(t) {
      camera.position.set(Math.sin(t * 0.05) * 2.4, 6.6, 9.4 + Math.cos(t * 0.05) * 0.3);
      camera.lookAt(0, 0.1, 0);

      const s = travelled(t, track.total);
      place(engine, s);
      carriages.forEach((car, i) => place(car, s - CAR_GAP * (i + 1)));
      // A little rock on the engine as it runs, stilled when it stops.
      const speed = (travelled(t + 0.05, track.total) - s) / 0.05;
      engine.rotation.z = Math.sin(t * 18) * 0.012 * Math.min(1, speed);

      // Smoke is emitted on a fixed beat; each puff sits where the chimney was when it left it.
      const phase = (t / PUFF_STEP) % 1;
      smoke.forEach(({ mesh, mat }, k) => {
        const age = (k + phase) * PUFF_STEP;
        const p = track.at(travelled(t - age, track.total) + 0.23);
        mesh.position.set(p.x, 0.6 + age * 0.35, p.z);
        mesh.scale.setScalar(0.7 + age * 0.8);
        mat.opacity = 0.75 * (1 - (k + phase) / SMOKE);
      });

      // The gate lowers as the engine comes within reach of the crossing and lifts once the last
      // carriage is clear.
      const ahead = (((crossingS - s) % track.total) + track.total) % track.total;
      const behind = track.total - ahead;
      const clear = CAR_GAP * 2 + 0.5;
      arm.rotation.z = 1.25 * smoothstep(1.8, 2.4, ahead) * smoothstep(clear, clear + 0.6, behind);
    },
    setTheme(th) {
      mats.board.color.set(th.board);
      mats.grass.color.set(th.grass);
      mats.hill.color.set(th.hill);
      mats.rail.color.set(th.rail);
      mats.sleeper.color.set(th.sleeper);
      mats.engine.color.set(th.engine);
      mats.carriage1.color.set(th.carriage1);
      mats.carriage2.color.set(th.carriage2);
      mats.trim.color.set(th.trim);
      mats.roof.color.set(th.roof);
      mats.wall.color.set(th.wall);
      mats.tree.color.set(th.tree);
      mats.water.color.set(th.water);
      smoke.forEach(({ mat }) => mat.color.set(th.smoke));
      hemi.groundColor.set(th.board);
    },
  };
};

/** A toy train running round an oval track on a diorama board, through a tunnel and past a station. */
export function ToyRailway3D(props: ThreeSceneProps<ToyRailwayTheme>) {
  return (
    <ThreeFrame
      {...props}
      defaultTheme={toyRailwayTheme}
      setup={setup}
      background={t => `radial-gradient(circle at 50% 40%, ${t.backdrop}, ${t.backdropEdge} 90%)`}
    />
  );
}
