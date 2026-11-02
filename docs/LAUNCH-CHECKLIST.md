# Launch checklist: nutanixvibes.com

One-time list for the relaunch of this site. It is not a page on the site. Do not copy it into `src/pages/`.

Adapted from the launch skill in [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT). Copyright (c) 2025 Corey Haines.

The source skill is a SaaS launch playbook. This file keeps its pre-launch site checks and its owned / rented / borrowed channel split. It leaves out Product Hunt, waitlists, affiliate programs, and any tool link from that skill. This repo has no traffic or follower numbers, so this list does not ask you to compare metrics.

Run it in three passes: before the merge to `main`, at the deploy, and in the first two weeks.

## Before the merge

`.github/workflows/deploy.yml` publishes on every push to `main`. Merging this branch is the cutover. Do this pass on the preview, then merge only when the boxes that block launch are done.

### Deploy and rollback

- [ ] `public/CNAME` is still the single line `nutanixvibes.com`, and a fresh `npm run build` copies it to `dist/CNAME`. The workflow uploads `dist`.
- [ ] Confirm the domain already points at GitHub Pages before the merge. This repo does not contain DNS records. If the domain is already correct, do not change DNS as part of the relaunch. If a DNS change is actually required, lower the TTL the day before. That DNS state was not checked from this repo.
- [ ] `deploy.yml` is still the file on `main`: Node `22`, `npm ci`, `npm run build`, upload `dist`. As of 2 Nov 2026 that Node setting installs 22.23.4, which matches `.nvmrc`. Do not edit the workflow in the same commit as the relaunch unless that check has gone stale.
- [ ] Rollback is a revert commit pushed to `main`. That push runs the same workflow and publishes `dist` from the reverted tree. `cancel-in-progress` is `false`, so a revert waits for an in-flight deploy to finish. A rollback has not been practiced.

### Original URLs, RSS, and search

- [ ] Both posts return HTTP 200 at the Casper paths, not under `/posts/`:
  - `https://nutanixvibes.com/nutanix-7-5-just-dropped-heres-what-actually-matters/`
  - `https://nutanixvibes.com/prism-central-tip-use-the-view-by-dropdown-for-faster-vm-audits/`
- [ ] `https://nutanixvibes.com/rss.xml` is an RSS document whose item links use those same paths.
- [ ] `https://nutanixvibes.com/feed.xml` is the old feed. It should refresh to `/rss.xml`, with a canonical link to `https://nutanixvibes.com/rss.xml`. Spot-check `/author/jamie/` (to `/about/`) and one `/tag/{tag}/` URL (to `/tags/{tag}/`). The full map is in `astro.config.ts`.
- [ ] `/search` returns the two posts for a word that appears in both, such as `prism`. Pagefind is built by `npm run build`. An empty box means the index was not in `dist`.

### What visitors see

- [ ] Home, one post, About, and search in dark mode and in light mode. Dark is the default (`src/layouts/Layout.astro`).
- [ ] The same four pages on a phone-width browser. Desktop screenshots at 1280 were taken for this preview. A phone pass was not.
- [ ] Replace or remove the EXAMPLE certification cards before launch. They are `src/content/certifications/example-0001.yaml` and `example-0002.yaml`, rendered at `/about#certifications`. The schema only accepts `label: EXAMPLE` until that schema is changed. Do not leave the fictional cards on the public About page.
- [ ] Decide what `/github-stats` should do. The page is a placeholder: every value is "Not fetched", and the nav still links to it. Either remove that nav link or keep the honest placeholder. Do not type in numbers by hand.

### SEO and social images

- [ ] Each indexable page has its own title, description, and one H1. Post titles and descriptions are the frontmatter in `src/content/posts/`.
- [ ] Canonical URLs use `https://nutanixvibes.com`, including the two post URLs above. The tag is written in `src/layouts/Layout.astro`.
- [ ] `robots.txt` allows crawling and points at the sitemap. It does not set `noindex` for the site. Redirect pages are `noindex`. Confirm the production HTML is not `noindex` either.
- [ ] Share one post URL and confirm the title, description, and image. Post images are the `ogImage` files under `public/assets/images/`. The site fallback is `public/og.jpg`. This preview did not load the LinkedIn or X share debugger.
- [ ] There is no privacy or terms page in this repo. Decide whether a personal blog needs one before launch. Do not invent a policy page in the same breath as the merge.

## At the switch

- [ ] Merge to `main` only. That is what runs `deploy.yml`. A branch push does not.
- [ ] When the Pages deploy is green, request the two post URLs, `/rss.xml`, `/feed.xml`, `/about#certifications`, and `/search` on the public host. You want 200 for the posts, RSS, About, and search, and a refresh on `/feed.xml`.
- [ ] Confirm `https://nutanixvibes.com` serves the new HTML over HTTPS. This repo does not record whether `www` redirects to the apex.
- [ ] Open `/search?q=prism` on the public host, not only in preview.
- [ ] Read the About page on the public host and confirm the EXAMPLE cards are gone.

## The first two weeks

This repo has no analytics snippet and no saved traffic numbers. Do not invent a before-and-after. Use this pass to catch broken URLs.

- [ ] Click through the two posts, tags, About, and search. Fix any link that still points at a `/posts/{slug}/` path or a `/tag/` path.
- [ ] If a person reports a 404 for an old Casper URL, add it to `legacyRedirects` in `astro.config.ts` only after you have seen that URL. The `main` build did not publish extra pagination pages.
- [ ] Keep a short list of bugs. Ship fixes by merging to `main`, which deploys again.

## Channel plan

Say that the blog is back, link to one real post, and send people to the site. Do not announce follower counts, traffic, or a launch-day total. None of those numbers are in this repo.

**Owned.** The site and `/rss.xml`. This is the place the other channels should point. There is no email list in this repo.

**Rented.** Two accounts already in `astro-paper.config.ts`:

- LinkedIn: [jamieterrell](https://www.linkedin.com/in/jamieterrell/). One post. Link to one of the two articles, not to the homepage only.
- X: [nutanixguy](https://x.com/nutanixguy). One post. Same rule.

**Borrowed.** Audiences Jamie does not own:

- Nutanix community. The About page says Jamie is a Nutanix Technology Champion. Post where he already talks with other Nutanix operators, with a link to a post on this site. Do not create a new community account for the relaunch.
- GitHub profile README for [nutanixguy](https://github.com/nutanixguy). That README lives in the `nutanixguy/nutanixguy` repo, not in this one. Add a line and a link to `https://nutanixvibes.com` there when the public site is actually the new build.

Skip Product Hunt, a waitlist, and any affiliate or referral program. They are not part of this relaunch.
