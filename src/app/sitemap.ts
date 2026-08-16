import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://scopeseal.codezela.com";
  const routes = [
    "",
    "/features",
    "/how-it-works",
    "/analyze",
    "/support",
    "/contact",
    "/privacy",
    "/terms",
    "/signin",
    "/signup",
  ];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
