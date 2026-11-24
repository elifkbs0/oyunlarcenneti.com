import {
  fetchGames,
  FEATURED_CATEGORIES,
  categoryLabel,
  CATEGORY_EMOJI,
} from "@/lib/gamepix";
import GameCard from "@/components/GameCard";
import Link from "next/link";

export const revalidate = 3600;

export default async function HomePage() {
  const fetches = await Promise.all([
    fetchGames({ pagination: 96 }),
    fetchGames({ pagination: 48, order: "pubdate" }),
    ...FEATURED_CATEGORIES.map((cat) =>
      fetchGames({ category: cat, pagination: 12 })
    ),
  ]);

  const trending = fetches[0];
  const newGames = fetches[1];
  const categoryFeeds = fetches.slice(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Ücretsiz Online Oyunlar
        </h1>
        <p className="text-gray-400 text-lg">
          Binlerce oyun — indirme yok, kayıt yok, hemen oyna!
        </p>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">🗂️ Kategoriler</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/kategori/${cat}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#1a1a2e] border border-[#2a2a3e] hover:border-amber-500/40 hover:bg-[#1f1f38] transition-all group"
            >
              <span className="text-2xl">{CATEGORY_EMOJI[cat] ?? "🎮"}</span>
              <span className="text-xs text-gray-300 group-hover:text-white text-center leading-tight font-medium">
                {categoryLabel(cat)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">🔥 Popüler Oyunlar</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {trending.items.map((game, i) => (
            <GameCard key={game.id} game={game} priority={i < 6} />
          ))}
        </div>
      </section>

      {/* New */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">✨ Yeni Oyunlar</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {newGames.items.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Category sections */}
      {FEATURED_CATEGORIES.map((cat, i) => {
        const feed = categoryFeeds[i];
        if (!feed?.items?.length) return null;
        return (
          <section key={cat}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                {CATEGORY_EMOJI[cat] ?? "🎮"} {categoryLabel(cat)}
              </h2>
              <Link
                href={`/kategori/${cat}`}
                className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
              >
                Tümünü gör →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {feed.items.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
