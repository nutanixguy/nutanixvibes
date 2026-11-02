import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://nutanixvibes.com",
    title: "Nutanix Vibes",
    description: "Good Vibes, Great Infrastructure",
    author: "Jamie Terrell",
    profile: "https://nutanixvibes.com",
    ogImage: "og.jpg",
    lang: "en",
    timezone: "America/New_York",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/nutanixguy",
      linkTitle: "Jamie Terrell on GitHub",
    },
    {
      name: "x",
      url: "https://x.com/nutanixguy",
      linkTitle: "Jamie Terrell on X",
    },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/jamieterrell/",
      linkTitle: "Jamie Terrell on LinkedIn",
    },
    {
      name: "mail",
      url: "mailto:jamie@nutanixguy.com",
      linkTitle: "Email Jamie Terrell",
    },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
