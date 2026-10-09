// Shared geometry for the scenes. Every scene draws into a portrait 400×700 viewBox.

export const W = 400;
export const H = 700;

/** One sine term of a ridge: [amplitude, wavelength, phase?]. */
export type Ridge = ReadonlyArray<readonly [amp: number, len: number, phase?: number]>;

/** Height of a ridge made of summed sines at x. */
export function ridgeY(x: number, y: number, components: Ridge): number {
  let h = y;
  for (const [amp, len, phase = 0] of components) h += amp * Math.sin((x / len) * Math.PI * 2 + phase);
  return h;
}

/**
 * A closed band 2×W wide whose edge follows ridgeY, filled toward `toward` (H = down, 0 = up).
 * Sliding it by W loops seamlessly as long as every wavelength divides W evenly.
 */
export function bandPath(y: number, components: Ridge, toward = H): string {
  let d = `M0 ${toward}`;
  for (let x = 0; x <= W * 2; x += 8) d += ` L${x} ${ridgeY(x, y, components).toFixed(1)}`;
  return `${d} L${W * 2} ${toward} Z`;
}

/** Deterministic PRNG so scattered details (stars, trees, bubbles) render identically on server and client. */
export function seeded(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
