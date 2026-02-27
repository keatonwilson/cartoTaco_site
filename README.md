# CartoTaco — Landing Site

Marketing site for [CartoTaco](https://carto-taco.vercel.app), a curated guide to Tucson's best small, local Mexican restaurants. No algorithms. No sponsored results. Just the spots worth knowing.

## Stack

- [Astro](https://astro.build/) — static site framework
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling via Vite plugin
- Deployed on [Vercel](https://vercel.com/)

## Project Structure

```
/
├── public/
│   ├── favicon.ico
│   ├── no_words.png          # Logo (icon only)
│   ├── color_light_bg.png    # Logo (with background)
│   └── carto_scrn_*.png      # App screenshots
├── src/
│   ├── pages/
│   │   └── index.astro       # Single-page site
│   └── styles/
│       └── global.css        # Tailwind config + custom tokens
└── astro.config.mjs
```

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Build

```bash
npm run build    # output to /dist
npm run preview  # preview the build locally
```

## Features

- Dark/light mode toggle (persisted via `localStorage`, flash-free)
- Fully responsive — mobile sticky CTA, desktop nav
- Grain texture overlay throughout
- Single `.astro` page, no JS framework
