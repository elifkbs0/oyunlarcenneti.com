import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www olmayan domain → www'ye yönlendir
      {
        source: "/:path*",
        has: [{ type: "host", value: "oyunlarcenneti.com" }],
        destination: "https://www.oyunlarcenneti.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.gamepix.com" },
    ],
  },
};

export default nextConfig;
