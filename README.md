# Nutanix Vibes

Tech blog built with [Casper Astro](https://github.com/AntonyLeons/casper) and hosted on GitHub Pages.

## Local development

```bash
npm install
SITE_URL=https://nutanixvibes.com npm run dev
```

Open [http://localhost:4321/](http://localhost:4321/).

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

Pushes to `main` deploy via GitHub Actions to https://nutanixvibes.com

Set the custom domain in GitHub repo **Settings → Pages** and point DNS at GitHub Pages (see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).

## Social links

Configured in `src/config.ts`:

- Email: jamie@nutanixguy.com
- GitHub: nutanixguy
- LinkedIn: jamieterrell
- X: nutanixguy
