# Spin the Wheel

A NextGen-branded elimination wheel built with Vite, React, and TypeScript.

26 teams start on the wheel. Every spin picks a winner and removes that team
from the roster; the last team standing is the champion. The roster is saved to
`localStorage`, so it survives reloads.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed local URL (usually <http://localhost:5173>).

```bash
npm run build      # type-check and build for production
npm run preview    # preview the production build
npm run typecheck  # TypeScript only
npm run lint       # oxlint
```

## Structure

```
public/
  logo/            Cropped NextGen logo marks used by the app
  favicon.svg      Gradient arrow favicon
src/
  components/
    Wheel.tsx      SVG wheel, pointer, and spin button
    TeamsPanel.tsx    Editable team roster, shuffle, reset
    ResultDialog.tsx  Winner modal
  data/teams.ts    Default teams, brand gradient recipes, helpers
  App.tsx          Spin state, rotation math, persistence
  index.css        Design tokens and global styles
  App.css          Page layout
Logo/              Brand logo source files (tracked)
```

## Team roster

Edit team names inline, add up to 32 teams, shuffle the order, or reset to the
default 26-team roster. The roster lives in `src/data/teams.ts` — edit the
`DEFAULT_TEAM_NAMES` list there to change it.

## Brand

The wheel cycles through gradient recipes from the supplied **Gradients** sheet
(pink → red, blue → violet, the light variants, and the triple-stop blends),
with colors sampled from the swatch set:

| Color   | Hex       |
| ------- | --------- |
| Violet  | `#6A5EED` |
| Orange  | `#FFA333` |
| Blue    | `#25B6F3` |
| Pink    | `#D912D9` |
| Green   | `#00FF7F` |
| Red     | `#FB4B4E` |
| Yellow  | `#FFD819` |
| Neutral | `#A7ADBE` |
| Ink     | `#2B2F3B` |

Display type falls back to **Archivo** (Google Fonts) until the licensed
**CY Grotesk Std** family is available.

## Design assets

The repository is intentionally scoped to the app plus the `Logo/` folder.
Everything else at the project root — the color swatches, typography sheets,
visual element sheets, and their header images — is ignored via `.gitignore`.

To version more of the design system, remove the relevant patterns from
`.gitignore`:

```gitignore
/*.png
/Typography/
/Visual elements/
```
