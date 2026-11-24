import {
  findGame,
  fetchGames,
  embedUrl,
  thumbnailUrl,
  slugToTitle,
  categoryLabel,
} from "@/lib/gamepix";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cat?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { cat } = await searchParams;
  const game = await findGame(slug, cat);
  const title = game?.title ?? slugToTitle(slug);
  return {
    title,
    description: game?.description ?? `${title} oyna – ücretsiz online oyun!`,
    openGraph: {
      images: [{ url: thumbnailUrl(slug, 600), width: 600 }],
    },
  };
}

export default async function GamePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { cat } = await searchParams;

  const [game, relatedFeed] = await Promise.all([
    findGame(slug, cat),
    fetchGames({ category: cat, pagination: 24 }),
  ]);

  const title = game?.title ?? slugToTitle(slug);
  const description = game?.description;
  const category = game?.category ?? cat;
  const isPortrait = game?.orientation === "portrait";
  const iframeUrl = game?.url ?? embedUrl(slug);
  const related = relatedFeed.items.filter((g) => g.namespace !== slug).slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">
          Ana Sayfa
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              href={`/kategori/${category}`}
              className="hover:text-white transition-colors capitalize"
            >
              {categoryLabel(category)}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-300">{title}</span>
      </nav>

      <div className="flex gap-5 items-start">
        {/* Main */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>

          <div
            className={`w-full rounded-2xl overflow-hidden border border-[#2a2a3e] bg-black mb-5 ${
              isPortrait ? "max-w-sm mx-auto" : ""
            }`}
          >
            <iframe
              src={iframeUrl}
              title={title}
              className="w-full"
              style={{
                aspectRatio: isPortrait ? "3/4" : "16/9",
                border: "none",
                display: "block",
              }}
              allowFullScreen
              allow="autoplay; fullscreen; *"
            />
          </div>

          {description && (
            <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2a2a3e]">
              <h2 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">
                Oyun Hakkında
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
            </div>
          )}
        </div>

        {/* Sidebar - related games */}
        {related.length > 0 && (
          <aside className="w-52 shrink-0 hidden lg:block">
            <h3 className="text-sm font-semibold text-white mb-3">Benzer Oyunlar</h3>
            <div className="flex flex-col gap-2">
              {related.map((g) => (
                <Link
                  key={g.id}
                  href={`/oyun/${g.namespace}?cat=${g.category}`}
                  className="flex gap-2.5 items-center rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] p-2 hover:border-amber-500/40 hover:bg-[#1f1f38] transition-all group"
                >
                  <div className="relative w-16 h-9 rounded shrink-0 overflow-hidden bg-[#0f0f1a]">
                    <Image
                      src={g.banner_image}
                      alt={g.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate leading-snug group-hover:text-amber-400 transition-colors">
                      {g.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {g.category.replace(/-/g, " ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
