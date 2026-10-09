// Shared plumbing for the lightweight SVG scenes (<boat-scene>, <lighthouse-scene>, …).
// Every scene is pure SVG + CSS keyframes in a portrait 400×700 viewBox: no WebGL and
// no per-frame JavaScript. Scenes pause while off-screen and hold still for reduced motion.

export const W = 400;
export const H = 700;

// Height of a ridge made of summed sines at x. components: [amp, wavelength, phase?][]
export function ridgeY(x, y, components) {
  let h = y;
  for (const [amp, len, phase = 0] of components) h += amp * Math.sin((x / len) * Math.PI * 2 + phase);
  return h;
}

// A closed band 2×W wide whose edge follows ridgeY, filled toward `toward` (H = down, 0 = up).
// Sliding it by W loops seamlessly as long as every wavelength divides W evenly.
export function bandPath(y, components, toward = H) {
  let d = `M0 ${toward}`;
  for (let x = 0; x <= W * 2; x += 8) d += ` L${x} ${ridgeY(x, y, components).toFixed(1)}`;
  return `${d} L${W * 2} ${toward} Z`;
}

// A band that optionally drifts sideways (`drift` seconds per loop) and swells up and down.
export function waveLayer({ y, components, fill, drift = 0, swell = 0, reverse = false, delay = 0, toward = H, opacity = 1 }) {
  const cls = drift ? ` class="drift${reverse ? ' reverse' : ''}" style="animation-duration:${drift}s"` : '';
  const op = opacity < 1 ? ` opacity="${opacity}"` : '';
  const path = `<path${cls}${op} fill="${fill}" d="${bandPath(y, components, toward)}"/>`;
  return swell ? `<g class="swell" style="animation-duration:${swell}s; animation-delay:${-delay}s">${path}</g>` : path;
}

// Deterministic PRNG so scattered details (stars, trees, bubbles) are identical on every load.
export function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE_CSS = `
  :host {
    --duration: 40s;
    display: block;
    position: relative;
    aspect-ratio: 4 / 7;
    width: 100%;
    overflow: hidden;
    contain: content;
  }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .overlay { position: absolute; inset: 0; pointer-events: none; }
  ::slotted(*) { pointer-events: auto; }

  .drift   { animation: drift linear infinite; }
  .reverse { animation-name: drift-reverse; }
  .swell   { animation: swell ease-in-out infinite alternate; }
  .across  { animation: across linear infinite; }
  .glint   { animation: glint ease-in-out infinite alternate; }

  @keyframes drift         { to   { transform: translateX(-${W}px); } }
  @keyframes drift-reverse { from { transform: translateX(-${W}px); } to { transform: translateX(0); } }
  @keyframes swell  { from { transform: translateY(-3px); } to { transform: translateY(3px); } }
  @keyframes across { from { transform: translateX(-260px); } to { transform: translateX(${W + 260}px); } }
  @keyframes glint  { from { opacity: 0.25; } to { opacity: 0.85; } }

  :host(.paused) * { animation-play-state: paused !important; }
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; }
  }
`;

// Registers a custom element that renders `svg` (inner markup) with `css` layered on the base.
// Slotted children render on top of the scene. The `duration` attribute sets --duration.
export function defineScene(tag, { css = '', svg }) {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>${BASE_CSS}${css}</style>
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${svg}</svg>
    <div class="overlay"><slot></slot></div>`;

  class Scene extends HTMLElement {
    static observedAttributes = ['duration'];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      // Pause the animation while the element is scrolled out of view.
      this._observer = new IntersectionObserver(([entry]) => {
        this.classList.toggle('paused', !entry.isIntersecting);
      });
      this._observer.observe(this);
    }

    disconnectedCallback() {
      this._observer?.disconnect();
    }

    attributeChangedCallback(name, _old, value) {
      if (name === 'duration') {
        const seconds = parseFloat(value);
        if (seconds > 0) this.style.setProperty('--duration', `${seconds}s`);
      }
    }
  }

  if (!customElements.get(tag)) customElements.define(tag, Scene);
}
