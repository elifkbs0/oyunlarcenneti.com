import Link from "next/link";
import Image from "next/image";
import type { Game } from "@/lib/gamepix";

interface Props {
  game: Game;
  priority?: boolean;
}

export default function GameCard({ game, priority = false }: Props) {
  return (
    <Link
      href={`/oyun/${game.namespace}?cat=${game.category}`}
      className="group block rounded-xl overflow-hidden bg-[#1a1a2e] border border-[#2a2a3e] hover:border-amber-500/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10"
    >
      <div className="relative aspect-video overflow-hidden bg-[#0f0f1a]">
        <Image
          src={game.banner_image}
          alt={game.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-amber-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
            <span className="text-black text-sm ml-0.5">▶</span>
          </div>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-sm font-medium text-white truncate leading-snug">{game.title}</p>
        <p className="text-xs text-gray-500 capitalize mt-0.5">{game.category.replace(/-/g, " ")}</p>
      </div>
    </Link>
  );
}
