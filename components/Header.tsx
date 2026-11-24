import Link from "next/link";
import { FEATURED_CATEGORIES, categoryLabel, CATEGORY_EMOJI } from "@/lib/gamepix";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0f0f1a]/95 backdrop-blur-sm border-b border-[#2a2a3e]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight shrink-0">
          <span className="text-2xl">🎮</span>
          <span>Oyunlar Cenneti</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm overflow-x-auto flex-1">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/kategori/${cat}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a2e] transition-colors whitespace-nowrap"
            >
              <span>{CATEGORY_EMOJI[cat]}</span>
              <span>{categoryLabel(cat)}</span>
            </Link>
          ))}
        </nav>

        <Link
          href="/ara"
          className="ml-auto p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a2e] transition-colors"
          aria-label="Oyun Ara"
        >
          <Search size={18} />
        </Link>
      </div>
    </header>
  );
}
