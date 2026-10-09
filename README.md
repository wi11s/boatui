# Quiet Scenes

Prebuilt animated SVG scene components for React. Import a finished scene instead of generating one.

Each scene is a portrait SVG illustration animated with CSS keyframes only: no WebGL, canvas or JavaScript animation loop. Scenes render on the server, pause while off-screen and show a still frame under `prefers-reduced-motion`. Generating a scene from scratch is roughly 1,300–2,300 output tokens before any visual iteration; importing one is under 20.

```bash
npx degit wi11s/boatui/components/scenes components/scenes
```

| Component | Scene |
| --- | --- |
| `<BoatScene />` | A sailboat crossing gentle waves on a calm afternoon |
| `<LighthouseScene />` | A lighthouse beam sweeping a moonlit sea as a steamer passes |
| `<BalloonScene />` | A hot-air balloon rising over rolling hills at dawn |
| `<ReefScene />` | A sea turtle gliding across a sunlit reef |
| `<TrainScene />` | A steam train crossing a stone viaduct at dusk |

## Run the site

```bash
npm install
npm run dev      # http://localhost:3000
```

The site has a gallery and a page per scene with a live playground (duration, pause, colours), props, theme tokens and the full source to copy.

For agents and other non-browser readers, the site also serves plain-text docs generated from `lib/registry.ts`: `/llms.txt` (index), `/llms-full.txt` (everything, including source) and `/scenes/<name>.md` (one scene).

## Use a scene in your project

Requires React 18+ (the site uses Next.js 16, but the components don't depend on Next).

1. Copy the shared files from `components/scenes/` once:
   `geometry.ts`, `scene.tsx`, `scene-frame.tsx`, `scene.module.css`
2. Copy the scenes you want, two files each, e.g. `boat-scene.tsx` and `boat-scene.module.css`.
3. Render it:

```tsx
import { BoatScene } from '@/components/scenes/boat-scene';

export function Hero() {
  return (
    <BoatScene duration={60} theme={{ hull: '#2f6fb0' }}>
      <h1>Slow crossings</h1>
    </BoatScene>
  );
}
```

A scene fills the width of its container at a 4:7 aspect ratio. Override the aspect ratio or height with `className`/`style`, and the art crops to fit.

### Props (every scene)

| Prop | Type | Description |
| --- | --- | --- |
| `duration` | `number` | Seconds for the scene's main crossing |
| `theme` | `Partial<…Theme>` | Override any colour token |
| `paused` | `boolean` | Freeze the animation |
| `className`, `style` | | Applied to the outer element |
| `children` | `ReactNode` | Rendered on top of the scene |

Theme tokens are also exposed as CSS variables (`skyTop` → `--sky-top`, `water1` → `--water-1`).

## Project layout

```
app/                      the documentation site
components/scenes/        the library: copy from here
  geometry.ts             viewBox size, wave/ridge paths, seeded random
  scene.tsx               shared props, WaveLayer, per-instance SVG ids
  scene-frame.tsx         client frame: sizing, theming, overlay, off-screen pause
  scene.module.css        shared motion primitives and reduced-motion handling
  *-scene.tsx / .css      one scene each
components/site/          playground, code blocks, cards (site only)
lib/registry.ts           scene metadata: names, descriptions, props, themes
lib/llms.ts               generates /llms.txt, /llms-full.txt and /scenes/<name>.md
lib/analytics.ts          Vercel Analytics custom events
prototypes/               the original Three.js and web-component experiments
```

## Contributing

New scenes and fixes are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines, or [open an issue](https://github.com/wi11s/boatui/issues) to suggest a scene.

## Adding a scene

1. Create `components/scenes/<name>-scene.tsx` and `<name>-scene.module.css`. Draw into the 400×700 viewBox and render it through `SceneFrame` with a `defaultTheme` and `defaultDuration`, following an existing scene.
2. Use `WaveLayer`/`bandPath` for layered bands (every wavelength must divide 400 for seamless loops), `seeded()` for scattered details, and `useSvgId()` for gradient ids.
3. Animate with CSS only. Put the animated class on an inner `<g>` when the element also needs a `transform` attribute, since a CSS transform replaces it.
4. Export it from `components/scenes/index.ts` and add an entry to `lib/registry.ts`.

## License

[MIT](./LICENSE)
