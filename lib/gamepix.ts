const FEED_BASE = "https://feeds.gamepix.com/v2/json";

export interface Game {
  id: string;
  namespace: string;
  title: string;
  description?: string;
  category: string;
  image: string;
  banner_image: string;
  url: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape" | "all";
  quality_score: number;
  date_published: string;
  date_modified: string;
}

export interface Feed {
  items: Game[];
  next_url?: string;
}

// Turkish labels for categories
export const CATEGORY_LABELS: Record<string, string> = {
  action: "Aksiyon",
  adventure: "Macera",
  airplane: "Uçak",
  arcade: "Arcade",
  ball: "Top",
  battle: "Savaş",
  "battle-royale": "Battle Royale",
  bike: "Bisiklet",
  block: "Blok",
  board: "Masa",
  car: "Araba",
  card: "Kart",
  casual: "Casual",
  cats: "Kedi",
  cooking: "Yemek",
  dinosaur: "Dinozor",
  "dress-up": "Kız Giydirme",
  driving: "Sürüş",
  farming: "Çiftlik",
  girls: "Kız",
  "hyper-casual": "Hyper Casual",
  io: ".io",
  "match-3": "Match-3",
  math: "Matematik",
  multiplayer: "Çok Oyunculu",
  puzzle: "Bulmaca",
  racing: "Yarış",
  shooting: "Nişancı",
  sports: "Spor",
  strategy: "Strateji",
  tanks: "Tank",
  zombie: "Zombi",
};

export const FEATURED_CATEGORIES = [
  "action",
  "puzzle",
  "sports",
  "racing",
  "adventure",
  "shooting",
  "strategy",
  "arcade",
  "girls",
  "dress-up",
  "casual",
  "zombie",
  "io",
  "car",
  "cooking",
  "multiplayer",
];

export const CATEGORY_EMOJI: Record<string, string> = {
  action: "⚔️",
  puzzle: "🧩",
  sports: "⚽",
  racing: "🏎️",
  adventure: "🗺️",
  shooting: "🎯",
  strategy: "♟️",
  arcade: "👾",
  girls: "👗",
  "dress-up": "💃",
  casual: "🎪",
  zombie: "🧟",
  io: "🌐",
  car: "🚗",
  cooking: "🍳",
  multiplayer: "🤝",
};

export function embedUrl(namespace: string): string {
  return `https://play.gamepix.com/${namespace}/embed?sid=1`;
}

export function thumbnailUrl(namespace: string, w = 320): string {
  return `https://img.gamepix.com/games/${namespace}/cover/${namespace}.png?w=${w}`;
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? slugToTitle(category);
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function fetchGames(
  opts: {
    page?: number;
    pagination?: 12 | 24 | 48 | 96;
    order?: "pubdate" | "";
    category?: string;
  } = {}
): Promise<Feed> {
  const params = new URLSearchParams({
    page: String(opts.page ?? 1),
    pagination: String(opts.pagination ?? 48),
  });
  if (opts.order) params.set("order", opts.order);
  if (opts.category) params.set("category", opts.category);

  try {
    const res = await fetch(`${FEED_BASE}?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { items: [] };
    return res.json();
  } catch {
    return { items: [] };
  }
}

// Find a single game by namespace slug, searching category first if provided
export async function findGame(
  namespace: string,
  category?: string
): Promise<Game | null> {
  const sources: Parameters<typeof fetchGames>[0][] = category
    ? [
        { category, pagination: 96 },
        { pagination: 96 },
      ]
    : [{ pagination: 96 }];

  for (const opts of sources) {
    for (let page = 1; page <= 2; page++) {
      const { items, next_url } = await fetchGames({ ...opts, page });
      const hit = items.find((g) => g.namespace === namespace);
      if (hit) return hit;
      if (!next_url) break;
    }
  }
  return null;
}
