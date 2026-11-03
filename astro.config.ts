import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { rehypeTableWrapper } from "./src/utils/rehypeTableWrapper";
import config from "./astro-paper.config";

// Real URLs from the Casper build on main that this theme no longer serves.
// Post URLs stay at /{slug}/, so they are not in this list.
const legacyRedirects: Record<string, string> = {
  "/feed.xml": "/rss.xml",
  "/author/jamie": "/about/",
  "/author/jamie/feed.xml": "/rss.xml",
  "/tag/ahv": "/tags/ahv/",
  "/tag/ahv/feed.xml": "/rss.xml",
  "/tag/cvm": "/tags/cvm/",
  "/tag/cvm/feed.xml": "/rss.xml",
  "/tag/ngt": "/tags/ngt/",
  "/tag/ngt/feed.xml": "/rss.xml",
  "/tag/nutanix": "/tags/nutanix/",
  "/tag/nutanix/feed.xml": "/rss.xml",
  "/tag/prism-central": "/tags/prism-central/",
  "/tag/prism-central/feed.xml": "/rss.xml",
  "/tag/tips": "/tags/tips/",
  "/tag/tips/feed.xml": "/rss.xml",
};

function pathnameOf(page: string): string {
  return new URL(page).pathname.replace(/\/$/, "") || "/";
}

// /start-here/ was a reading list. That copy now lives on /about/.
const retiredRedirects: Record<string, string> = {
  "/start-here": "/about/",
};

const redirectPaths = new Set(
  [...Object.keys(legacyRedirects), ...Object.keys(retiredRedirects)].map(
    path => path.replace(/\/$/, "") || "/"
  )
);

export default defineConfig({
  site: config.site.url,
  redirects: { ...legacyRedirects, ...retiredRedirects },
  integrations: [
    mdx(),
    sitemap({
      filter: page => {
        const path = pathnameOf(page);
        if (path === "/certifications" || redirectPaths.has(path)) return false;
        return (
          config.features?.showArchives !== false ||
          !page.endsWith("/archives/")
        );
      },
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeTableWrapper],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      provider: fontProviders.google(),
      fallbacks: ["ui-monospace", "monospace"],
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
