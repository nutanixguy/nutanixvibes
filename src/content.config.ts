import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

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
    label: z.literal("EXAMPLE"),
    credentialId: z.string(),
    issued: z.string(),
    summary: z.string(),
  }),
});

export const collections = { posts, pages, certifications };
