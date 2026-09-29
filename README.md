# Atelier — Mechanical time

An original interactive 3D skeleton watch built with Three.js. Steel case, stitched leather strap, moving brass gears, balance spring, live local clock, and exhibition back.

Drag to orbit; scroll or pinch to zoom. Keyboard: arrow keys rotate, + / - zoom. Dial and Movement select the view; Reset restores the initial view. Auto rotation is opt-in. Local time is read fresh on every frame, including after tab suspension; the computer's clock is the time source. The compound gear train uses matching pitch-circle spacing and tooth-count ratios. A timed escapement releases eight times per second, with a four-cycle-per-second balance and a deforming hairspring anchored at its outer stud. These are coordinated kinematic animations, not a contact-force or watch-regulation simulation. Gear tooth profiles and pallet contact geometry are simplified.

The **Open movement** slider lifts the dial, hands and bridges, exposing the same train from both sides. **Slow motion** slows the internal mechanism to 8% speed while the hands and digital readout continue showing actual local time. Reset closes the assembly and restores normal speed.

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

Production files are in `dist/`. Relative asset paths support GitHub Pages project sites. No server, account, API keys, or ongoing local process is needed once hosted. Space Grotesk and Cormorant Garamond are bundled locally alongside the JavaScript. A small 3D Manhattan-inspired miniature accompanies the America/New_York timezone; it uses the browser timezone, not GPS or location permission.

## Publishing

The included GitHub Actions workflow tests, builds and deploys every push to `main`. The repository's Pages source must be **GitHub Actions**. The public site is served by GitHub, independent of the owner's computer.

## Verification

Automated checks cover midnight, fractional hand interpolation, time jumps, gear spacing and ratios, escapement locking, the fourth wheel period, hairspring anchors, and finite 3D geometry during opening. The latest movement update was verified through code checks only, as requested. Browser checks are performed against the live canvas, front/back controls, auto rotation, reset and narrow layout. WebGL is required; an explanatory fallback appears if unavailable.
