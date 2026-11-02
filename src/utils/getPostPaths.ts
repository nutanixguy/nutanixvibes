import { getRelativeLocaleUrl } from "astro:i18n";
import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import config from "@/config";

function getPostPathSegments(filePath: string | undefined): string[] {
  return (
    filePath
      ?.replace(BLOG_PATH, "")
      .split("/")
      .filter(path => path !== "")
      .filter(path => !path.startsWith("_"))
      .slice(0, -1)
      .map(segment => slugifyStr(segment)) ?? []
  );
}

function getIdSlug(id: string): string {
  const postId = id.split("/");
  return postId.length > 0 ? String(postId[postId.length - 1]) : id;
}

function getPostSlugPath(id: string, filePath: string | undefined): string {
  const pathSegments = getPostPathSegments(filePath);
  const slug = getIdSlug(id);
  return pathSegments.length > 0
    ? [...pathSegments, slug].join("/")
    : String(slug);
}

/**
 * Returns the slug-only path for use as a route param in `getStaticPaths`.
 * No base prefix, no locale — Astro handles those at a higher level.
 * e.g. `/examples/my-post`
 */
export function getPostSlug(id: string, filePath: string | undefined): string {
  return `/${getPostSlugPath(id, filePath)}`;
}

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
