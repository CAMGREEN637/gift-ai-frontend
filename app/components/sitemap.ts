import { getAllArticles } from "@/content/articles";

export default function sitemap() {
  const articles = getAllArticles();

  const blogEntries = articles.map((article) => ({
    url: `https://regala.ai/blog/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://regala.ai",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: "https://regala.ai/blog",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...blogEntries,
  ];
}