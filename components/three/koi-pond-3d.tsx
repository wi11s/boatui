'use client';

// <KoiPond3D>: a garden pond seen from above. Five koi swim slow loops under the surface, their
// bodies bending side to side as they go. Lily pads bob, one with a pink lotus, rings spread
// where something touched the water, reeds sway and a dragonfly hovers and darts. three.js.

import * as THREE from 'three';
import { ThreeFrame, seeded, type SceneSetup, type ThreeSceneProps } from './three-frame';

export const koiPondTheme = {
  grass: '#7cbf6a',
  shore: '#d9c9a3',
  pondFloor: '#2c5e63',
  water: '#4fa3a8',
  koi: '#f2763a',
  koiWhite: '#fbf6ee',
  koiGold: '#f5c04a',
  lilyPad: '#5aa65a',
  lotus: '#f4a3c0',
  rock: '#9aa1a6',
  reed: '#5f8f3e',
  bush: '#4f9a52',
  dragonfly: '#3d7fd1',
};
export type KoiPondTheme = typeof koiPondTheme;

const WATER_Y = -0.08;
const DEPTH = 0.75;

/** The pond's irregular outline: its radius at angle a. */
const pondRadius = (a: number) => 3.2 + 0.35 * Math.sin(3 * a + 0.4) + 0.22 * Math.cos(5 * a + 1);

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** How the koi bends: its body swings side to side, more toward the tail. Fish-local x runs tail → head. */
const bend = (x: number, t: number, phase: number) => 0.11 * Math.sin(t * 5 + phase - x * 4) * ((0.55 - x) / 1.1) ** 2;

type Koi = {
  group: THREE.Group;
  parts: { geo: THREE.BufferGeometry; base: Float32Array }[];
  body: THREE.BufferGeometry;
  /** Per body vertex: 0 white, 1 orange, 2 gold. */
  mask: Uint8Array;
  path: (t: number) => [number, number];
  y: number;
  phase: number;
};

const setup: SceneSetup<KoiPondTheme> = ({ scene, camera, theme }) => {
  const rand = seeded(41);

  const flat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, ...extra });
  const mats = {
    ground: new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }),
    water: new THREE.MeshStandardMaterial({ color: theme.water, transparent: true, opacity: 0.32, roughness: 0.15, metalness: 0.1, depthWrite: false }),
    koi: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5 }),
    fin: new THREE.MeshStandardMaterial({ color: theme.koiWhite, transparent: true, opacity: 0.75, side: THREE.DoubleSide, roughness: 0.6 }),
    eye: new THREE.MeshBasicMaterial({ color: '#1d1d22' }),
    pad: flat(theme.lilyPad, { side: THREE.DoubleSide }),
    lotus: flat(theme.lotus, { side: THREE.DoubleSide }),
    lotusCore: flat('#f6d55c'),
    rock: flat(theme.rock),
    reed: flat(theme.reed),
    bush: flat(theme.bush),
    flower: flat('#ffffff'),
    cattail: flat('#7a5236'),
    dragonfly: flat(theme.dragonfly, { roughness: 0.4 }),
    wing: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }),
  };

  const hemi = new THREE.HemisphereLight('#e8f4ff', theme.grass, 1.1);
  const sun = new THREE.DirectionalLight('#fff4e0', 1.6);
  sun.position.set(4, 8, 3);
  scene.add(hemi, sun);

  // Ground: rings that follow the pond's outline, from the deep middle out across the lawn, so
  // the shore is a clean low-poly curve. Each band of faces takes one colour: pond floor, a
  // sandy shore, then grass.
  const RINGS = [0, 0.35, 0.6, 0.78, 0.9, 0.97, 1.03, 1.08, 1.2, 1.6, 2.6, 5];
  const SEGMENTS = 72;
  const ringPoint = (j: number, k: number): [number, number, number] => {
    const a = (k / SEGMENTS) * Math.PI * 2;
    const d = RINGS[j];
    const r = d * pondRadius(a);
    const y = d < 1.03 ? -DEPTH * (1 - smoothstep(0.5, 1.03, d)) : 0;
    return [Math.cos(a) * r, y, Math.sin(a) * r];
  };
  const positions: number[] = [];
  const bands: number[] = [];
  for (let j = 0; j < RINGS.length - 1; j++) {
    for (let k = 0; k < SEGMENTS; k++) {
      const a = ringPoint(j, k);
      const b = ringPoint(j, k + 1);
      const c = ringPoint(j + 1, k);
      const d = ringPoint(j + 1, k + 1);
      positions.push(...a, ...b, ...d, ...a, ...d, ...c);
      bands.push(j, j);
    }
  }
  const groundGeo = new THREE.BufferGeometry();
  groundGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  groundGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(positions.length), 3));
  const paintGround = (th: KoiPondTheme) => {
    const grass = new THREE.Color(th.grass);
    const shore = new THREE.Color(th.shore);
    const floor = new THREE.Color(th.pondFloor);
    const c = new THREE.Color();
    const colors = groundGeo.attributes.color as THREE.BufferAttribute;
    bands.forEach((j, f) => {
      const d = (RINGS[j] + RINGS[j + 1]) / 2;
      if (d > 1.07) c.copy(grass);
      else if (d > 0.93) c.copy(shore);
      else c.copy(floor).lerp(shore, smoothstep(0.3, 0.93, d) * 0.45);
      for (let k = 0; k < 3; k++) colors.setXYZ(f * 3 + k, c.r, c.g, c.b);
    });
    colors.needsUpdate = true;
  };
  paintGround(theme);
  groundGeo.computeVertexNormals();
  scene.add(new THREE.Mesh(groundGeo, mats.ground));

  // Water: a flat, see-through sheet. The lawn rises above it outside the pond and hides it.
  const water = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), mats.water);
  water.rotation.x = -Math.PI / 2;
  water.position.y = WATER_Y;
  water.renderOrder = 1;
  scene.add(water);

  // Rocks around the shore, fewer at the front so the pond stays open to the camera.
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2;
    if (Math.sin(a) > 0.6 && rand() > 0.3) continue;
    const r = pondRadius(a) * (1.02 + rand() * 0.08);
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 + rand() * 0.18, 0), mats.rock);
    rock.position.set(Math.cos(a) * r, 0.02, Math.sin(a) * r);
    rock.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    rock.scale.y = 0.6;
    scene.add(rock);
  }

  // Low bushes and little white flowers dotted over the lawn.
  for (let i = 0; i < 9; i++) {
    const a = rand() * Math.PI * 2;
    const r = pondRadius(a) * (1.35 + rand() * 0.5);
    const bush = new THREE.Group();
    for (let k = 0; k < 3; k++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22 + rand() * 0.12, 0), mats.bush);
      puff.position.set((rand() - 0.5) * 0.4, 0.12 + rand() * 0.08, (rand() - 0.5) * 0.4);
      bush.add(puff);
    }
    bush.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    scene.add(bush);
  }
  const flowerGeo = new THREE.IcosahedronGeometry(0.04, 0);
  for (let i = 0; i < 40; i++) {
    const a = rand() * Math.PI * 2;
    const r = pondRadius(a) * (1.15 + rand() * 0.9);
    const flower = new THREE.Mesh(flowerGeo, mats.flower);
    flower.position.set(Math.cos(a) * r, 0.03, Math.sin(a) * r);
    scene.add(flower);
  }

  // Reeds with cattails in a clump at the back left; each sways from its base.
  const reeds = Array.from({ length: 9 }, () => {
    const a = 3.6 + rand() * 0.7;
    const r = pondRadius(a) * (0.92 + rand() * 0.12);
    const h = 0.8 + rand() * 0.6;
    const reed = new THREE.Group();
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, h, 4), mats.reed);
    stalk.position.y = h / 2;
    reed.add(stalk);
    if (rand() > 0.35) {
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 6), mats.cattail);
      tail.position.y = h - 0.12;
      reed.add(tail);
    }
    reed.position.set(Math.cos(a) * r, WATER_Y, Math.sin(a) * r);
    scene.add(reed);
    return { reed, phase: rand() * 6 };
  });

  // Lily pads: discs with a notch, floating and bobbing. The first carries a lotus.
  const padSpots: [number, number, number][] = [
    [1.4, -1.2, 0.42],
    [1.95, -0.55, 0.3],
    [-1.6, 0.9, 0.36],
    [-1.1, 1.5, 0.26],
    [0.6, -2.1, 0.3],
    [-2.2, -0.9, 0.32],
  ];
  const pads = padSpots.map(([x, z, r], i) => {
    const pad = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CircleGeometry(r, 14, 0.35, Math.PI * 2 - 0.7), mats.pad);
    disc.rotation.x = -Math.PI / 2;
    pad.add(disc);
    if (i === 0) {
      const lotus = new THREE.Group();
      for (let k = 0; k < 8; k++) {
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 4), mats.lotus);
        petal.scale.set(0.45, 1, 0.3);
        const a = (k / 8) * Math.PI * 2;
        petal.position.set(Math.cos(a) * 0.08, 0.1, Math.sin(a) * 0.08);
        petal.lookAt(Math.cos(a) * 0.5, 0.5, Math.sin(a) * 0.5);
        petal.rotateX(Math.PI / 2);
        lotus.add(petal);
      }
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05, 0), mats.lotusCore);
      core.position.y = 0.1;
      lotus.add(core);
      pad.add(lotus);
    }
    pad.position.set(x, WATER_Y + 0.01, z);
    pad.rotation.y = rand() * Math.PI * 2;
    scene.add(pad);
    return { pad, phase: rand() * 6 };
  });

  // Koi. Each part's geometry is built in the fish's own frame (x from tail to head) and bent
  // every frame from a copy of its rest positions.
  const makeKoi = (pattern: number, seed: number): Omit<Koi, 'path' | 'y' | 'phase'> => {
    const r = seeded(seed);
    const group = new THREE.Group();
    const profile = [
      [0.02, -0.55],
      [0.05, -0.42],
      [0.1, -0.2],
      [0.13, 0.05],
      [0.12, 0.25],
      [0.08, 0.38],
      [0.0, 0.46],
    ].map(([rr, y]) => new THREE.Vector2(rr, y));
    const body = new THREE.LatheGeometry(profile, 10);
    body.rotateZ(-Math.PI / 2);
    body.scale(1, 0.7, 1);
    body.computeVertexNormals();
    // Patches: blobs of orange on white (kohaku), white with an orange head, or all gold.
    const bp = body.attributes.position;
    const mask = new Uint8Array(bp.count);
    const blobs = Array.from({ length: 3 }, () => [-0.35 + r() * 0.75, (r() - 0.5) * 0.1, 0.1 + r() * 0.08]);
    for (let i = 0; i < bp.count; i++) {
      const x = bp.getX(i);
      const z = bp.getZ(i);
      if (pattern === 2) mask[i] = 2;
      else if (pattern === 1) mask[i] = x > 0.12 ? 1 : 0;
      else mask[i] = blobs.some(([bx, bz, br]) => Math.hypot(x - bx, (z - bz) * 1.6) < br) ? 1 : 0;
    }
    body.setAttribute('color', new THREE.BufferAttribute(new Float32Array(bp.count * 3), 3));
    group.add(new THREE.Mesh(body, mats.koi));

    const tail = new THREE.Shape();
    tail.moveTo(-0.5, 0);
    tail.quadraticCurveTo(-0.7, 0.05, -0.86, 0.2);
    tail.quadraticCurveTo(-0.76, 0, -0.86, -0.2);
    tail.quadraticCurveTo(-0.7, -0.05, -0.5, 0);
    const tailGeo = new THREE.ShapeGeometry(tail, 6);
    tailGeo.rotateX(-Math.PI / 2);
    group.add(new THREE.Mesh(tailGeo, mats.fin));

    const fins = new THREE.Shape();
    for (const side of [1, -1]) {
      fins.moveTo(0.18, side * 0.08);
      fins.lineTo(0.02, side * 0.26);
      fins.lineTo(0.06, side * 0.08);
      fins.closePath();
    }
    const finGeo = new THREE.ShapeGeometry(fins);
    finGeo.rotateX(-Math.PI / 2);
    group.add(new THREE.Mesh(finGeo, mats.fin));

    const eyes = new THREE.BufferGeometry();
    const eyeParts = [0.06, -0.06].map(z => new THREE.IcosahedronGeometry(0.018, 0).translate(0.34, 0.04, z));
    eyes.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([...eyeParts[0].attributes.position.array, ...eyeParts[1].attributes.position.array]), 3),
    );
    group.add(new THREE.Mesh(eyes, mats.eye));

    const parts = [body, tailGeo, finGeo, eyes].map(geo => ({ geo, base: Float32Array.from(geo.attributes.position.array) }));
    scene.add(group);
    return { group, parts, body, mask };
  };

  const kois: Koi[] = [
    { pattern: 0, path: (t: number) => [Math.cos(t * 0.22) * 1.9, Math.sin(t * 0.44) * 0.9] as [number, number], y: -0.2 },
    { pattern: 1, path: (t: number) => [Math.cos(-t * 0.18 + 2) * 2.1, Math.sin(-t * 0.18 + 2) * 1.6] as [number, number], y: -0.28 },
    { pattern: 2, path: (t: number) => [0.4 + Math.cos(t * 0.27 + 4) * 1.2, -0.3 + Math.sin(t * 0.27 + 4) * 1.4] as [number, number], y: -0.17 },
    { pattern: 0, path: (t: number) => [Math.sin(t * 0.2 + 1) * 1.5, Math.cos(t * 0.4 + 2) * 1.3 - 0.2] as [number, number], y: -0.34 },
    { pattern: 1, path: (t: number) => [-0.6 + Math.cos(t * 0.25 + 1) * 1.1, 0.6 + Math.sin(t * 0.25 + 1) * 0.8] as [number, number], y: -0.24 },
  ].map(({ pattern, path, y }, i) => ({ ...makeKoi(pattern, 100 + i), path, y, phase: i * 1.9 }));

  const paintKoi = (th: KoiPondTheme) => {
    const palette = [new THREE.Color(th.koiWhite), new THREE.Color(th.koi), new THREE.Color(th.koiGold)];
    for (const k of kois) {
      const colors = k.body.attributes.color as THREE.BufferAttribute;
      k.mask.forEach((m, i) => colors.setXYZ(i, palette[m].r, palette[m].g, palette[m].b));
      colors.needsUpdate = true;
    }
  };
  paintKoi(theme);

  // Ripples: rings that spread and fade at a new spot each cycle (spot chosen from the cycle number).
  const ripples = Array.from({ length: 4 }, (_, k) => {
    const mat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.RingGeometry(0.92, 1, 40), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = 2;
    scene.add(mesh);
    return { mesh, mat, period: 4 + k * 0.9, offset: k * 1.3 };
  });
  const hash = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };

  // Dragonfly: a slim body with four wings that blur, hovering then darting to a new spot.
  const dragonfly = new THREE.Group();
  const dfBody = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.012, 0.42, 5), mats.dragonfly);
  dfBody.rotation.z = Math.PI / 2;
  const dfHead = new THREE.Mesh(new THREE.IcosahedronGeometry(0.04, 0), mats.dragonfly);
  dfHead.position.x = 0.22;
  dragonfly.add(dfBody, dfHead);
  const wings = [0.08, 0.0].flatMap(x =>
    [1, -1].map(side => {
      const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.22), mats.wing);
      wing.geometry.translate(0, side * 0.11, 0);
      wing.rotation.x = -Math.PI / 2;
      wing.position.set(x, 0.02, 0);
      dragonfly.add(wing);
      return { wing, side };
    }),
  );
  scene.add(dragonfly);
  /** Where the dragonfly hovers in each 5s hop: it holds still, then darts to the next spot. */
  const hoverSpot = (n: number) => {
    const a = hash(n + 3) * Math.PI * 2;
    const r = 0.8 + hash(n + 7) * 1.6;
    return new THREE.Vector3(Math.cos(a) * r, 0.5 + hash(n + 11) * 0.4, Math.sin(a) * r);
  };

  return {
    update(t) {
      camera.position.set(Math.sin(t * 0.04) * 2.5, 8.2, Math.cos(t * 0.04) * 6.8);
      camera.lookAt(0, -0.3, 0.2);

      for (const k of kois) {
        const [x, z] = k.path(t);
        const [nx, nz] = k.path(t + 0.05);
        k.group.position.set(x, k.y, z);
        k.group.rotation.y = Math.atan2(-(nz - z), nx - x);
        for (const { geo, base } of k.parts) {
          const p = geo.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < p.count; i++) {
            const bx = base[i * 3];
            p.setXYZ(i, bx, base[i * 3 + 1], base[i * 3 + 2] + bend(bx, t, k.phase));
          }
          p.needsUpdate = true;
        }
      }

      pads.forEach(({ pad, phase }) => {
        pad.position.y = WATER_Y + 0.01 + Math.sin(t * 0.9 + phase) * 0.012;
        pad.rotation.z = Math.sin(t * 0.7 + phase) * 0.03;
      });
      reeds.forEach(({ reed, phase }) => {
        reed.rotation.z = Math.sin(t * 0.8 + phase) * 0.06;
        reed.rotation.x = Math.sin(t * 0.6 + phase * 2) * 0.04;
      });

      ripples.forEach(({ mesh, mat, period, offset }, k) => {
        const cycle = Math.floor((t + offset) / period);
        const p = ((t + offset) % period) / period;
        const a = hash(cycle * 4 + k) * Math.PI * 2;
        const r = Math.sqrt(hash(cycle * 4 + k + 0.5)) * 2.2;
        mesh.position.set(Math.cos(a) * r, WATER_Y + 0.005, Math.sin(a) * r);
        mesh.scale.setScalar(0.05 + p * 0.7);
        mat.opacity = 0.5 * (1 - p);
      });

      // Dragonfly: hold for most of each hop, dart to the next spot at the end, bobbing all the time.
      const hop = t / 5;
      const n = Math.floor(hop);
      const dart = smoothstep(0.8, 1, hop - n);
      const from = hoverSpot(n);
      const to = hoverSpot(n + 1);
      dragonfly.position.lerpVectors(from, to, dart);
      dragonfly.position.y += Math.sin(t * 3) * 0.03;
      dragonfly.rotation.y = Math.atan2(-(to.z - from.z), to.x - from.x);
      wings.forEach(({ wing, side }, i) => {
        wing.rotation.x = -Math.PI / 2 + side * Math.sin(t * 60 + i) * 0.5;
      });
    },
    setTheme(th) {
      paintGround(th);
      paintKoi(th);
      mats.water.color.set(th.water);
      mats.fin.color.set(th.koiWhite);
      mats.pad.color.set(th.lilyPad);
      mats.lotus.color.set(th.lotus);
      mats.rock.color.set(th.rock);
      mats.reed.color.set(th.reed);
      mats.bush.color.set(th.bush);
      mats.dragonfly.color.set(th.dragonfly);
      hemi.groundColor.set(th.grass);
    },
  };
};

/** A garden pond from above: koi swimming loops under lily pads, ripples and a dragonfly. */
export function KoiPond3D(props: ThreeSceneProps<KoiPondTheme>) {
  return <ThreeFrame {...props} defaultTheme={koiPondTheme} setup={setup} background={t => t.grass} />;
}
