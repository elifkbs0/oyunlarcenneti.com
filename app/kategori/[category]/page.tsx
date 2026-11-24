import { fetchGames, categoryLabel } from "@/lib/gamepix";
import GameCard from "@/components/GameCard";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabel(category);
  return {
    title: `${label} Oyunları`,
    description: `En iyi ücretsiz ${label.toLowerCase()} oyunlarını oyna! HTML5, indirme yok.`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));

  const label = categoryLabel(category);
  const { items, next_url } = await fetchGames({ category, page, pagination: 48 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">
          Ana Sayfa
        </Link>
        <span>/</span>
        <span className="text-gray-300">{label}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{label} Oyunları</h1>
        <p className="text-gray-400 text-sm mt-1">
          En iyi ücretsiz {label.toLowerCase()} oyunları
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🎮</p>
          <p>Bu kategoride oyun bulunamadı.</p>
          <Link href="/" className="text-amber-500 hover:underline mt-2 inline-block">
            Ana sayfaya dön
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.map((game, i) => (
              <GameCard key={game.id} game={game} priority={i < 6} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-10">
            {page > 1 && (
              <Link
                href={`/kategori/${category}?page=${page - 1}`}
                className="px-5 py-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] text-sm text-white hover:border-amber-500/40 transition-colors"
              >
                ← Önceki
              </Link>
            )}
            <span className="text-sm text-gray-400 px-2">Sayfa {page}</span>
            {next_url && (
              <Link
                href={`/kategori/${category}?page=${page + 1}`}
                className="px-5 py-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] text-sm text-white hover:border-amber-500/40 transition-colors"
              >
                Sonraki →
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
