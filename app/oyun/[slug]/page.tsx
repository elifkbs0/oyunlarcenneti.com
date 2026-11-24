import {
  findGame,
  embedUrl,
  thumbnailUrl,
  slugToTitle,
  categoryLabel,
} from "@/lib/gamepix";
import type { Metadata } from "next";
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
    description:
      game?.description ??
      `${title} oyna – ücretsiz online HTML5 oyun!`,
    openGraph: {
      images: [{ url: thumbnailUrl(slug, 600), width: 600 }],
    },
  };
}

export default async function GamePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { cat } = await searchParams;
  const game = await findGame(slug, cat);

  const title = game?.title ?? slugToTitle(slug);
  const description = game?.description;
  const category = game?.category ?? cat;
  const isPortrait = game?.orientation === "portrait";
  const iframeUrl = game?.url ?? embedUrl(slug);

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

      <h1 className="text-2xl font-bold text-white mb-5">{title}</h1>

      {/* Game iframe */}
      <div
        className={`w-full rounded-2xl overflow-hidden border border-[#2a2a3e] bg-black mb-6 ${isPortrait ? "max-w-sm mx-auto" : ""}`}
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

      {/* Description */}
      {description && (
        <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2a2a3e]">
          <h2 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">
            Oyun Hakkında
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}
