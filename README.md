# Nutanix Vibes

Preview of the blog rebuilt on [AstroPaper](https://github.com/satnaing/astro-paper) (MIT). This branch is a throwaway preview. Do not merge it to `main`.

The live site is still the Casper theme on `main`. Pushes to `main` are what deploy to GitHub Pages. This branch does not change that workflow.

## Local development

Node.js 22.23.4 or newer (`engines` and `.nvmrc`).

```bash
npm ci
npm run dev
```

Open [http://localhost:4321/](http://localhost:4321/).

Search uses Pagefind, which indexes `dist/` during `npm run build`. `npm run dev` can show an empty search box until you have built once.

## Checks

```bash
npm run lint
npm run format:check
npm run build
npm run preview
```

## Content

- Posts: `src/content/posts/`
- About page: `src/content/pages/about.md`
- Example certifications: `src/content/certifications/`
- Site config: `astro-paper.config.ts`
- Images: `public/assets/images/`

## License

The theme is included under the MIT license. See `LICENSE`. Copyright (c) 2023 Sat Naing.
