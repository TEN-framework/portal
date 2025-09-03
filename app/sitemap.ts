import type { MetadataRoute } from "next";
import { blog, source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theten.ai";
  const languages = ["en", "cn"];

  // Generate blog URLs
  const blogPosts = blog.getPages();
  const blogUrls = blogPosts.flatMap((post) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/blog/${post.url}`,
      lastModified: new Date(post.data.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Generate docs URLs
  const docPages = source.getPages();
  const docUrls = docPages.flatMap((page) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/docs/${page.url}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // Add static pages
  const staticPages = languages.flatMap((lang) => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${lang}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ]);

  return [...staticPages, ...blogUrls, ...docUrls];
}
