# Atelier — Mechanical time

An original interactive 3D skeleton watch built with Three.js. Steel case, stitched leather strap, moving brass gears, balance spring, live local clock, and exhibition back.

Drag to orbit; scroll or pinch to zoom. Keyboard: arrow keys rotate, + / - zoom. Dial and Movement select the view; Reset restores the initial view. Auto rotation is opt-in. Local time is read fresh on every frame, including after tab suspension; the computer's clock is the time source. Gear motion is an artistic mechanical interpretation, not an engineering simulation.

## Local development

Node.js 22.12 or later:

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

Production files are in `dist/`. Relative asset paths support GitHub Pages project sites. No server, account, API keys, or ongoing local process is needed once hosted. Fonts load from Google Fonts with system fallbacks; all JavaScript is bundled.

## Publishing

The included GitHub Actions workflow tests, builds and deploys every push to `main`. The repository's Pages source must be **GitHub Actions**. The public site is served by GitHub, independent of the owner's computer.

## Verification

Clock tests cover midnight, fractional hand interpolation, and a large time jump. Browser checks are performed against the live canvas, front/back controls, auto rotation, reset and narrow layout. WebGL is required; an explanatory fallback appears if unavailable.
