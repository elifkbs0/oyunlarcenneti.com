import type { MetadataRoute } from "next";
import { fetchGames, FEATURED_CATEGORIES } from "@/lib/gamepix";

export const revalidate = 3600;

const BASE = "https://www.oyunlarcenneti.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch up to 5 pages of games for the sitemap
  const pages = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      fetchGames({ pagination: 96, page: i + 1 })
    )
  );

  const games = Array.from(
    new Map(
      pages.flatMap((p) => p.items).map((g) => [g.id, g])
    ).values()
  );

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...FEATURED_CATEGORIES.map((cat) => ({
      url: `${BASE}/kategori/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...games.map((game) => ({
      url: `${BASE}/oyun/${game.namespace}`,
      lastModified: new Date(game.date_modified),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
