'use client';

// <TinyPlanet3D>: a small low-poly planet turning slowly, with trees, cottages with smoking
// chimneys, a windmill, a pond, grazing sheep, orbiting clouds, a moon and a starfield,
// all wrapped in a soft atmospheric glow. three.js.

import * as THREE from 'three';
import { ThreeFrame, seeded, type SceneSetup, type ThreeSceneProps } from './three-frame';

export const tinyPlanetTheme = {
  skyTop: '#141a3a',
  skyBottom: '#3d3270',
  ground: '#7cc576',
  leaves: '#3f9d5a',
  trunk: '#8a5a3c',
  walls: '#fbf3e4',
  roof: '#e4573d',
  cloud: '#ffffff',
  moon: '#e3ddd0',
  stars: '#ffffff',
  water: '#5fb4d9',
  glow: '#8fb8ff',
};
export type TinyPlanetTheme = typeof tinyPlanetTheme;

const RADIUS = 1.8;
const UP = new THREE.Vector3(0, 1, 0);

/** Stand an object on the surface, pointing outward along `dir`. */
function plant(object: THREE.Object3D, dir: THREE.Vector3, lift = 0) {
  object.position.copy(dir).multiplyScalar(RADIUS - 0.02 + lift);
  object.quaternion.setFromUnitVectors(UP, dir);
  return object;
}

function randomDir(rand: () => number) {
  const u = rand() * 2 - 1;
  const theta = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return new THREE.Vector3(s * Math.cos(theta), u, s * Math.sin(theta));
}

const setup: SceneSetup<TinyPlanetTheme> = ({ scene, camera, theme }) => {
  const rand = seeded(5);
  camera.position.set(0, 1.4, 9.5);
  camera.lookAt(0, 0, 0);

  const flat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...extra });
  const mats = {
    ground: flat(theme.ground),
    leaves: flat(theme.leaves),
    trunk: flat(theme.trunk),
    walls: flat(theme.walls),
    roof: flat(theme.roof),
    cloud: flat(theme.cloud, { roughness: 1 }),
    moon: flat(theme.moon),
    door: flat('#5a3e2b'),
    window: new THREE.MeshStandardMaterial({ color: '#ffd98a', emissive: '#ffb84d', emissiveIntensity: 0.9 }),
    water: flat(theme.water, { roughness: 0.2, metalness: 0.1 }),
    wool: flat('#f6f2ea'),
    face: flat('#3b3330'),
    stone: flat('#9a9aa6'),
  };
  const smokeMats: THREE.MeshStandardMaterial[] = [];

  const hemi = new THREE.HemisphereLight('#dfe8ff', theme.skyBottom, 1.3);
  const sun = new THREE.DirectionalLight('#fff1d6', 2.4);
  sun.position.set(5, 6, 4);
  const rim = new THREE.DirectionalLight('#9fb4ff', 0.9);
  rim.position.set(-4, 2, -5);
  scene.add(hemi, sun, rim);

  // Planet: an icosphere with gentle seeded bumps.
  const world = new THREE.Group();
  world.rotation.z = 0.25;
  scene.add(world);
  const planetGeo = new THREE.IcosahedronGeometry(RADIUS, 4);
  const pos = planetGeo.attributes.position;
  const v = new THREE.Vector3();
  const bumps = new Map<string, number>();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`; // shared vertices move together
    if (!bumps.has(key)) bumps.set(key, 1 + (rand() - 0.5) * 0.035);
    v.multiplyScalar(bumps.get(key)!);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  planetGeo.computeVertexNormals();
  world.add(new THREE.Mesh(planetGeo, mats.ground));

  // Cottages first, so trees can keep their distance.
  const taken: THREE.Vector3[] = [];
  const smoke: THREE.Mesh[] = [];
  const house = (dir: THREE.Vector3) => {
    const g = new THREE.Group();
    const walls = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.26, 0.3), mats.walls);
    walls.position.y = 0.13;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.29, 0.2, 4), mats.roof);
    roof.position.y = 0.36;
    roof.rotation.y = Math.PI / 4;
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 0.02), mats.door);
    door.position.set(0, 0.06, 0.155);
    const window = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), mats.window);
    window.position.set(0.09, 0.15, 0.155);
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.06), mats.walls);
    chimney.position.set(-0.08, 0.4, -0.05);
    g.add(walls, roof, door, window, chimney);
    // Smoke: puffs that rise from the chimney, swell and fade on a loop.
    for (let k = 0; k < 4; k++) {
      const mat = flat('#f4f1fa', { transparent: true, depthWrite: false, roughness: 1, emissive: '#b9b4cc', emissiveIntensity: 0.5 });
      smokeMats.push(mat);
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.045, 1), mat);
      puff.userData.offset = k / 4;
      smoke.push(puff);
      g.add(puff);
    }
    g.rotateY(rand() * Math.PI * 2);
    taken.push(dir);
    world.add(plant(g, dir));
  };
  [new THREE.Vector3(0.3, 0.8, 0.5), new THREE.Vector3(-0.7, 0.2, 0.7), new THREE.Vector3(0.6, -0.3, -0.7)].forEach(d =>
    house(d.normalize()),
  );

  // Windmill with four blades.
  const blades = new THREE.Group();
  {
    const dir = new THREE.Vector3(-0.2, 0.7, -0.68).normalize();
    taken.push(dir);
    const g = new THREE.Group();
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.11, 0.7, 6), mats.walls);
    tower.position.y = 0.35;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.14, 6), mats.roof);
    cap.position.y = 0.76;
    blades.position.set(0, 0.68, 0.1);
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.01), mats.walls);
      blade.position.y = 0.18;
      const arm = new THREE.Group();
      arm.rotation.z = (i * Math.PI) / 2;
      arm.add(blade);
      blades.add(arm);
    }
    g.add(tower, cap, blades);
    world.add(plant(g, dir));
  }

  // A pond: a flat disc pressed into the surface, ringed with stones.
  {
    const dir = new THREE.Vector3(0.75, 0.35, 0.55).normalize();
    taken.push(dir);
    const g = new THREE.Group();
    const pond = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 9), mats.water);
    pond.position.y = 0.015;
    g.add(pond);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + rand() * 0.3;
      const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.04 + rand() * 0.02, 0), mats.stone);
      stone.position.set(Math.cos(a) * 0.32, 0.02, Math.sin(a) * 0.32);
      g.add(stone);
    }
    world.add(plant(g, dir));
  }

  // Sheep graze in a little flock, nodding their heads.
  const sheepHeads: THREE.Object3D[] = [];
  {
    const centre = new THREE.Vector3(-0.35, 0.55, 0.75).normalize();
    taken.push(centre);
    for (let i = 0; i < 4; i++) {
      const dir = centre.clone().add(new THREE.Vector3((rand() - 0.5) * 0.35, (rand() - 0.5) * 0.35, (rand() - 0.5) * 0.35)).normalize();
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 0), mats.wool);
      body.scale.set(1.3, 0.9, 1);
      body.position.y = 0.09;
      const head = new THREE.Group();
      head.position.set(0.1, 0.1, 0);
      const face = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.045), mats.face);
      face.position.x = 0.025;
      head.add(face);
      for (const x of [-0.04, 0.04]) {
        for (const z of [-0.03, 0.03]) {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.06, 0.018), mats.face);
          leg.position.set(x, 0.03, z);
          g.add(leg);
        }
      }
      g.add(body, head);
      g.rotateY(rand() * Math.PI * 2);
      sheepHeads.push(head);
      world.add(plant(g, dir));
    }
  }

  // Flowers scattered in the grass.
  const petals = ['#ffd166', '#f78fb3', '#ffffff'].map(c => flat(c));
  for (let i = 0; i < 26; i++) {
    const dir = randomDir(rand);
    if (taken.some(t => t.angleTo(dir) < 0.2)) continue;
    const flower = new THREE.Mesh(new THREE.IcosahedronGeometry(0.03, 0), petals[i % 3]);
    flower.position.y = 0.03;
    world.add(plant(new THREE.Group().add(flower), dir));
  }

  // Trees: a mix of cones and round tops, kept away from buildings.
  let planted = 0;
  while (planted < 22) {
    const dir = randomDir(rand);
    if (taken.some(t => t.angleTo(dir) < 0.32)) continue;
    taken.push(dir);
    planted++;
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.2, 5), mats.trunk);
    trunk.position.y = 0.1;
    const round = rand() > 0.5;
    const top = round
      ? new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 0), mats.leaves)
      : new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.4, 6), mats.leaves);
    top.position.y = round ? 0.32 : 0.38;
    g.add(trunk, top);
    g.scale.setScalar(0.8 + rand() * 0.5);
    world.add(plant(g, dir));
  }

  // Clouds on tilted orbits, each a cluster of puffs.
  const orbits: { pivot: THREE.Object3D; speed: number }[] = [];
  for (let i = 0; i < 5; i++) {
    const pivot = new THREE.Object3D();
    // Gentle tilts keep clouds near the equator, so they read as clouds from the camera.
    pivot.rotation.set((rand() - 0.5) * 0.6, rand() * Math.PI * 2, (rand() - 0.5) * 0.5);
    const cloud = new THREE.Group();
    const puffs = 3 + Math.floor(rand() * 2);
    for (let p = 0; p < puffs; p++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13 + rand() * 0.08, 1), mats.cloud);
      puff.position.set((p - puffs / 2) * 0.16, rand() * 0.06, (rand() - 0.5) * 0.08);
      cloud.add(puff);
    }
    cloud.scale.set(1, 0.7, 1);
    cloud.position.set(0, 0, RADIUS + 0.75);
    pivot.add(cloud);
    scene.add(pivot);
    orbits.push({ pivot, speed: 0.12 + rand() * 0.12 });
  }

  // Atmosphere: only the far side of a slightly larger shell is drawn, so it reads as a halo
  // behind the planet: brightest at the planet's edge, fading to nothing at the shell's edge.
  const glowMat = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(theme.glow) } },
    vertexShader: `varying vec3 vNormal; varying vec3 vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform vec3 color; varying vec3 vNormal; varying vec3 vView;
      void main() {
        float facing = max(-dot(vNormal, vView), 0.0);
        float halo = smoothstep(0.0, 0.6, facing);
        gl_FragColor = vec4(color, halo * halo * 0.32);
      }`,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 1.25, 48, 32), glowMat);
  scene.add(atmosphere);

  // Moon.
  const moonPivot = new THREE.Object3D();
  moonPivot.rotation.x = 0.35;
  const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), mats.moon);
  moon.position.set(3.4, 0.4, 0);
  moonPivot.add(moon);
  scene.add(moonPivot);

  // Stars on a distant shell.
  const starPositions = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) {
    const d = randomDir(rand).multiplyScalar(40 + rand() * 20);
    starPositions.set([d.x, d.y, d.z], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ color: theme.stars, size: 0.18, sizeAttenuation: true, transparent: true, opacity: 0.85 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  return {
    update(time) {
      world.rotation.y = time * 0.12;
      world.position.y = Math.sin(time * 0.6) * 0.05;
      blades.rotation.z = time * 1.8;
      orbits.forEach((o, i) => o.pivot.rotation.set(o.pivot.rotation.x, i * 1.3 + time * o.speed, o.pivot.rotation.z));
      moonPivot.rotation.y = time * 0.08;
      moon.rotation.y = time * 0.2;
      stars.rotation.y = time * 0.004;
      atmosphere.position.y = world.position.y;
      smoke.forEach((puff, i) => {
        const phase = (time * 0.35 + puff.userData.offset) % 1;
        puff.position.set(-0.08 + phase * 0.12, 0.5 + phase * 0.42, -0.05);
        puff.scale.setScalar(0.5 + phase * 1.4);
        smokeMats[i].opacity = 0.85 * Math.sin(phase * Math.PI) ** 0.7;
      });
      sheepHeads.forEach((head, i) => {
        // Graze: dip the head for a while, then look up.
        const nod = Math.max(0, Math.sin(time * 0.6 + i * 1.7));
        head.rotation.z = -0.7 * nod;
      });
    },
    setTheme(t) {
      mats.ground.color.set(t.ground);
      mats.leaves.color.set(t.leaves);
      mats.trunk.color.set(t.trunk);
      mats.walls.color.set(t.walls);
      mats.roof.color.set(t.roof);
      mats.cloud.color.set(t.cloud);
      mats.moon.color.set(t.moon);
      starMat.color.set(t.stars);
      hemi.groundColor.set(t.skyBottom);
      mats.water.color.set(t.water);
      glowMat.uniforms.color.value.set(t.glow);
    },
  };
};

/** A small low-poly planet turning slowly, with trees, cottages, a windmill and orbiting clouds. */
export function TinyPlanet3D(props: ThreeSceneProps<TinyPlanetTheme>) {
  return (
    <ThreeFrame
      {...props}
      defaultTheme={tinyPlanetTheme}
      setup={setup}
      background={t => `radial-gradient(circle at 50% 45%, ${t.skyBottom}, ${t.skyTop} 75%)`}
    />
  );
}
