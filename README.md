# Nutanix Vibes

Static blog for [nutanixvibes.com](https://nutanixvibes.com), built with [Astro](https://astro.build) and hosted on GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Import WordPress content

Place a WordPress export XML file in `imports/`, then run:

```bash
python3 scripts/import-wordpress.py
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushes to `main` deploy automatically via GitHub Actions once GitHub Pages is enabled for the repository.

GitHub project Pages serves the site from `/nutanixvibes/`. The deploy workflow sets `ASTRO_BASE=/nutanixvibes/` during builds. When `nutanixvibes.com` is connected as a custom domain, remove `ASTRO_BASE` from `.github/workflows/deploy.yml` so links use the site root.

## Project structure

- `src/content/blog/` — blog posts (Markdown)
- `src/pages/` — site pages
- `imports/` — WordPress export files
- `scripts/import-wordpress.py` — WordPress XML to Markdown converter
