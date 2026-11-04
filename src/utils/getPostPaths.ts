import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";
import { getPostSlugPath } from "./postSlug";

export { getPostSlug } from "./postSlug";

/**
 * Top-level routes that are not posts. A post file with one of these names
 * would replace that page, because post pages are served at /{slug}/.
 * github-stats and quest are not published. They stay reserved so a post
 * cannot take the URL a later page would use.
 */
const RESERVED_ROOT_SEGMENTS = new Set([
  "404",
  "about",
  "archives",
  "author",
  "certifications",
  "feed.xml",
  "github-stats",
  "og.png",
  "posts",
  "quest",
  "robots.txt",
  "roll-call",
  "rss.xml",
  "search",
  "start-here",
  "tag",
  "tags",
]);

export function assertPostRouteAvailable(
  id: string,
  filePath: string | undefined
): void {
  const slugPath = getPostSlugPath(id, filePath);
  const root = slugPath.split("/")[0] ?? slugPath;
  if (RESERVED_ROOT_SEGMENTS.has(root)) {
    throw new Error(
      `Post "${slugPath}" uses /${root}/, which is already a site page. Rename the post file.`
    );
  }
}

/**
 * Returns a fully navigable URL for use in `<a href>` and RSS links.
 * Posts stay at /{slug}/, the same path the Casper site published.
 * Applies locale routing and the configured Astro base via
 * `getRelativeLocaleUrl`.
 */
export function getPostUrl(
  id: string,
  filePath: string | undefined,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, getPostSlugPath(id, filePath));
}
