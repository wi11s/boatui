# Contributing to Quiet Scenes

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

### What makes a good Quiet Scene

- **Calm.** One main subject making a slow crossing, plus a few small ambient motions. Nothing should flash or move fast.
- **CSS only.** Animate with keyframes on `transform` and `opacity`. No JavaScript animation loops, canvas or WebGL.
- **Readable on top.** Leave the top of the card quiet enough for a heading and a line of text.
- **Themeable.** Expose the main colours as theme tokens with sensible defaults.
- **Considerate.** Check it with reduced motion turned on: it should still look like a complete picture when everything is still.

A CSS `transform` replaces an element's `transform` attribute, so put animated classes on an inner `<g>` when the element is also positioned with `transform`.

## Pull requests

- Keep each PR to one scene or one fix.
- Include a screenshot or short recording of the scene.
- By contributing, you agree that your work is released under the [MIT license](./LICENSE).
