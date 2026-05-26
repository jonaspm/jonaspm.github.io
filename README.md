# jonasperusquia.com

Personal portfolio site built with [Astro](https://astro.build) and Tailwind CSS, deployed to Cloudflare Pages.

## Tech Stack

- **Framework**: Astro 6 (static site generation)
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP + ScrollTrigger
- **Lint & Format**: Biome
- **Package Manager**: Bun
- **Analytics**: Clarity + OneDollarStats
- **Hosting**: Cloudflare Pages

## Getting Started

```sh
# Install dependencies
bun install

# Start dev server (http://localhost:4321)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
src/
├── assets/
│   ├── data/          # skills.json, social-networks.json
│   └── images/        # project screenshots, profile photos
├── components/        # Astro components (sections, SEO, nav, analytics)
├── content/
│   └── projects/      # content collection — JSON files per project
├── layouts/
│   └── Layout.astro   # base layout (meta, nav, footer, analytics)
├── pages/
│   ├── index.astro    # English (default locale, no prefix)
│   └── es/
│       └── index.astro # Spanish (/es/)
├── scripts/
│   └── gsap-animations.js
├── styles/
│   └── global.css     # Tailwind v4 config + custom theme
└── utils/
    ├── i18n.ts        # translations (en + es)
    └── seo.ts         # per-page SEO configuration
```

## Localization

English at `/`, Spanish at `/es/`. All strings are in `src/utils/i18n.ts`. Projects use localized fields for `description` and `skills`.

## License

Source code available under the [MIT License](LICENSE).
