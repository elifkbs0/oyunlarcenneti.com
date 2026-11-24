import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Oyunlar Cenneti – Ücretsiz Online Oyunlar",
    template: "%s | Oyunlar Cenneti",
  },
  description:
    "Binlerce ücretsiz HTML5 oyun oyna! Aksiyon, bulmaca, spor, yarış, macera ve daha fazlası. Hiç indirme yok, hemen oyna!",
  metadataBase: new URL("https://oyunlarcenneti.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#2a2a3e] mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Oyunlar Cenneti</p>
            <p className="mt-1">Oyunlar <a href="https://www.gamepix.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">GamePix</a> tarafından sağlanmaktadır</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
