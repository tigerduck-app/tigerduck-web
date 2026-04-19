import type { MetadataRoute } from "next";

const BASE_URL = "https://tigerduck.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1.0 },
    { path: "/privacy-policy", priority: 0.8 },
    { path: "/delete-account", priority: 0.8 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: page.priority,
      alternates: {
        languages: {
          "zh-TW": `${BASE_URL}${page.path}`,
          en: `${BASE_URL}/en${page.path}`,
        },
      },
    });
    entries.push({
      url: `${BASE_URL}/en${page.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: page.priority * 0.9,
      alternates: {
        languages: {
          "zh-TW": `${BASE_URL}${page.path}`,
          en: `${BASE_URL}/en${page.path}`,
        },
      },
    });
  }

  return entries;
}
