import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file, glob } from "astro/loaders";
import config from "@/config";
import { BLOG_PATH } from "@/content/blogPath";

export { BLOG_PATH };

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      // Built at /{slug}/, but left out of listings, feeds, sitemap, and search.
      unlisted: z.boolean().default(false),
      tags: z.array(z.string()).default(["others"]),
      // Root-relative public files stay strings. Relative paths still use Astro's
      // image helper so files under src/ can be optimized.
      ogImage: z
        .string()
        .refine(value => value.startsWith("/"), {
          message: "Public OG images must be root-relative",
        })
        .or(image())
        .optional(),
      // Cover alt, also og:image:alt. The post page falls back to the title.
      ogImageAlt: z.string().min(1).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      // An empty value means "not set", so the site timezone applies.
      timezone: z
        .string()
        .optional()
        .transform(tz => tz || undefined),
      level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      topic: z.string().optional(),
      prerequisites: z.array(z.string()).optional(),
      objectives: z.array(z.string()).optional(),
      est_minutes: z.number().int().positive().optional(),
      quest_id: z.string().optional(),
      updated: z.date().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

const certifications = defineCollection({
  loader: glob({
    pattern: "**/*.{yml,yaml}",
    base: "./src/content/certifications",
  }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    // YYYY-MM. Omitted when LinkedIn has no issue date.
    issued: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional(),
    // Newest first. Same-month ties use a suffix, for example 2024-12-02.
    sortKey: z.string(),
    url: z.url().optional(),
  }),
});

// Query keys that identify a campaign click rather than the page itself.
const trackingParams = new Set([
  "fbclid",
  "gclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "utm_campaign",
  "utm_content",
  "utm_id",
  "utm_medium",
  "utm_source",
  "utm_term",
]);

function httpsWithoutTracking(value: string): boolean {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:") return false;
  for (const key of parsed.searchParams.keys()) {
    if (trackingParams.has(key.toLowerCase())) return false;
  }
  return true;
}

const rollCall = defineCollection({
  loader: file("src/data/roll-call.yaml"),
  schema: z.object({
    name: z.string().trim().min(1),
    url: z.url().refine(httpsWithoutTracking, {
      message: "Use an https URL with no tracking parameters",
    }),
    author: z.string().trim().min(1).optional(),
    // Two letters, not an ISO check. TW is the code this page uses for Traditional Chinese.
    language: z.string().regex(/^[A-Z]{2}$/),
    focus: z
      .string()
      .trim()
      .min(1)
      .refine(value => !/[\r\n]/.test(value), {
        message: "Focus is one line",
      }),
  }),
});

export const collections = { posts, pages, certifications, rollCall };
