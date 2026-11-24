import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-6xl mb-4">🕹️</p>
      <h1 className="text-2xl font-bold text-white mb-2">Sayfa Bulunamadı</h1>
      <p className="text-gray-400 mb-6">
        Aradığın sayfa mevcut değil ya da taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
