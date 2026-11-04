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

### Unlisted posts

Add `unlisted: true` to a post's frontmatter when the page should exist at `/{slug}/` but stay out of the public lists. The field is optional and defaults to false.

An unlisted post is still built. It is left out of the home page, `/posts/` (including pagination), tag pages and the tag index, archives, `rss.xml`, the sitemap, Pagefind, and the previous/next links on other posts. Its HTML includes `<meta name="robots" content="noindex, nofollow">`.

`draft: true` is unchanged: the page is not built, even if `unlisted` is also set. An unlisted post whose `pubDatetime` is still in the future is built anyway, so you can open the URL before that day. It still does not appear in any list.

- About page: `src/content/pages/about.md`
- Example certifications: `src/content/certifications/`
- Site config: `astro-paper.config.ts`
- Images: optimized sources in `src/assets/images/` (Astro image pipeline). Site fallback OG image: `public/og.jpg`.

## License

The theme is included under the MIT license. See `LICENSE`. Copyright (c) 2023 Sat Naing.
