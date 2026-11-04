/**
 * Draft and unlisted flags, with no other imports.
 * `astro.config.ts` reaches this through the sitemap scan, which cannot import
 * `astro:env` or the site config.
 */
export function isDraftPost(data: { draft?: boolean }): boolean {
  return data.draft === true;
}

/** `unlisted: true` in frontmatter. Omitted and `false` stay public. */
export function isUnlistedPost(data: { unlisted?: boolean }): boolean {
  return data.unlisted === true;
}
