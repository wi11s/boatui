# Contributing to boatui

Thanks for wanting to help. New scenes, fixes to existing ones, docs improvements and ideas are all welcome.

## Ways to help

- **Suggest a scene.** Open an issue describing the moment you'd like to see (a train crossing a viaduct at dusk, say) and roughly what moves.
- **Report a problem.** Include the browser, the scene, and what looks wrong. A screenshot helps a lot.
- **Send a pull request** for a new scene or a fix.

Security problems go through private reporting instead; see [SECURITY.md](./SECURITY.md). Everyone taking part is expected to follow the [code of conduct](./CODE_OF_CONDUCT.md).

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # must pass before you open a PR
```

## Adding a scene

A scene is two files in `components/scenes/`: `<name>-scene.tsx` and `<name>-scene.module.css`. Start by copying an existing scene; `boat-scene.tsx` is the simplest.

1. Draw into the 400×700 portrait viewBox and render through `SceneFrame` with a `defaultTheme` and `defaultDuration`.
2. Use `WaveLayer`/`bandPath` for layered bands of water, hills or sand. Every wavelength must divide 400 so the loop is seamless.
3. Use `seeded()` for scattered details like stars or trees, so the server and browser render the same thing.
4. Use `useSvgId()` for gradient ids so several copies of a scene can share a page.
5. Export it from `components/scenes/index.ts` and add an entry to `lib/registry.ts`. The site picks it up from there.

## Adding a background

A background is two files in `components/backgrounds/`: `<name>-background.tsx` and `<name>-background.module.css`. Render through `BackgroundFrame` with a `defaultTheme` and a `layer`, following `snowfall-background.tsx`. Keep it CSS-only with no client JavaScript, and subtle enough to sit behind text. Export it from `components/backgrounds/index.ts` and add an entry to `lib/backgrounds.ts`.

## Adding an empty state

An empty state is two files in `components/empty-states/`: `empty-<name>.tsx` and `empty-<name>.module.css`. Draw into the 240×180 box through `EmptyStateFrame`, following `empty-nap.tsx`. Keep the motion gentle and looping, and leave room for the message underneath. Export it from `components/empty-states/index.ts` and add an entry to `lib/empty-states.ts`.

## Adding a loader

A loader is two files in `components/loaders/`: `<name>-loader.tsx` and `<name>-loader.module.css`. Draw into the 100×100 box through `LoaderFrame`, following `tea-loader.tsx`. Make one short, seamless loop (about 1.5–2.5 seconds), keep everything inside the box, and set `transform-box: fill-box` on anything you scale or rotate. Export it from `components/loaders/index.ts` and add an entry to `lib/loaders.ts`.

## Adding a 3D scene

A 3D scene is one file in `components/three/`: `<name>-3d.tsx`. Write a module-level `setup` that builds the scene and returns `update(time)` and `setTheme(theme)`, and render it through `ThreeFrame`, following `tiny-planet-3d.tsx`. Keep geometry low-poly, update materials in `setTheme` rather than rebuilding, and let the frame handle sizing, pausing and disposal. Export it from `components/three/index.ts` and add an entry to `lib/three.ts`.

### What makes a good component

- **Calm.** One main subject making a slow crossing, plus a few small ambient motions. Nothing should flash or move fast.
- **CSS only.** Animate with keyframes on `transform` and `opacity`. No JavaScript animation loops, canvas or WebGL.
- **Readable on top.** Leave the top of the card quiet enough for a heading and a line of text.
- **Themeable.** Expose the main colours as theme tokens with sensible defaults.
- **Considerate.** Check it with reduced motion turned on: it should still look like a complete picture when everything is still.

A CSS `transform` replaces an element's `transform` attribute, so put animated classes on an inner `<g>` when the element is also positioned with `transform`.

## Pull requests

- Open pull requests against `dev`, not `main`. `main` only receives `dev` through a merge-commit PR.

- Keep each PR to one scene or one fix.
- Include a screenshot or short recording of the scene.
- By contributing, you agree that your work is released under the [MIT license](./LICENSE).
