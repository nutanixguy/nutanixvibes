import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { BLOG_PATH } from "@/content/blogPath";
import { slugifyStr } from "./slugify";
import { getPostSlug } from "./postSlug";
import { isDraftPost, isUnlistedPost } from "./postVisibility";

/**
 * Top-level `key:` in YAML frontmatter. Last occurrence wins.
 * Only the boolean token `true` counts, matching the posts schema.
 * Absent keys are false. This does not parse the rest of the file.
 */
function frontmatterFlag(source: string, key: "draft" | "unlisted"): boolean {
  if (!source.startsWith("---")) return false;
  const end = source.indexOf("\n---", 3);
  if (end === -1) return false;
  const block = source.slice(source.indexOf("\n") + 1, end);
  let value = false;
  const prefix = `${key}:`;

  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith(" ") || line.startsWith("\t") || line.startsWith("#")) {
      continue;
    }
    if (!line.startsWith(prefix)) continue;
    const raw = line
      .slice(prefix.length)
      .trim()
      .replace(/\s+#.*$/, "");
    value = raw === "true" || raw === "True" || raw === "TRUE";
  }

  return value;
}

function walkPostFiles(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    if (entry.startsWith("_") || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkPostFiles(full));
      continue;
    }
    if (entry.endsWith(".md") || entry.endsWith(".mdx")) files.push(full);
  }
  return files;
}

/**
 * Pathnames of unlisted posts that are actually built.
 * Drafts stay out of the build, so they are not listed here.
 * The id passed to `getPostSlug` slugifies each segment. Astro's glob loader
 * uses `github-slugger` for that id. For the kebab-case filenames in
 * `src/content/posts/`, both produce the same path.
 */
function loadUnlistedPathnames(projectRoot: string): Set<string> {
  const base = join(projectRoot, BLOG_PATH);
  const paths = new Set<string>();

  for (const file of walkPostFiles(base)) {
    const source = readFileSync(file, "utf8");
    const data = {
      draft: frontmatterFlag(source, "draft"),
      unlisted: frontmatterFlag(source, "unlisted"),
    };
    if (!isUnlistedPost(data) || isDraftPost(data)) continue;

    const rel = relative(base, file).split(sep).join("/");
    const ext = rel.endsWith(".mdx") ? ".mdx" : ".md";
    const relNoExt = rel.slice(0, -ext.length);
    const id = relNoExt
      .split("/")
      .map(segment => slugifyStr(segment))
      .join("/");
    const slug = getPostSlug(id, `${BLOG_PATH}/${rel}`);
    const pathname = slug.replace(/\/$/, "") || "/";
    paths.add(pathname);
  }

  return paths;
}

let cachedRoot: string | undefined;
let cachedPaths: Set<string> | undefined;

function unlistedPathnames(): Set<string> {
  const root = process.cwd();
  if (!cachedPaths || cachedRoot !== root) {
    cachedRoot = root;
    cachedPaths = loadUnlistedPathnames(root);
  }
  return cachedPaths;
}

/** True for an unlisted post URL and for files generated under it, such as `index.png`. */
export function isUnlistedSitemapPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  for (const slug of unlistedPathnames()) {
    if (normalized === slug || normalized.startsWith(`${slug}/`)) return true;
  }
  return false;
}
