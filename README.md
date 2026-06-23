# Nutanix Vibes

Tech blog built with [Casper Astro](https://github.com/AntonyLeons/casper) and hosted on GitHub Pages.

## Local development

```bash
npm install
SITE_URL=https://nutanixguy.github.io BASE_PATH=/nutanixvibes/ npm run dev
```

Open [http://localhost:4321/nutanixvibes/](http://localhost:4321/nutanixvibes/).

For local preview without the GitHub Pages subpath:

```bash
npm run dev
```

## Content

- Posts: `src/content/posts/`
- About page: `src/data/about.md`
- Author profile: `src/content/authors/jamie.json`
- Site config (title, social links): `src/config.ts`
- Images: `public/assets/images/`

## Import WordPress content

Place a WordPress export XML file in `imports/`, then run:

```bash
python3 scripts/import-wordpress.py
```

Note: the import script targets the legacy blog layout. After migrating to Casper, add new posts manually under `src/content/posts/`.

## Deploy

Pushes to `main` deploy via GitHub Actions.

GitHub project Pages uses `BASE_PATH=/nutanixvibes/` during CI builds. When `nutanixvibes.com` is connected as a custom domain, remove `BASE_PATH` from `.github/workflows/deploy.yml`.

## Social links

Configured in `src/config.ts`:

- Email: jamie@nutanixguy.com
- GitHub: nutanixguy
- LinkedIn: jamieterrell
- X: nutanixguy
