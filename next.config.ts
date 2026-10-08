import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Live tour/hotel photos come straight from the Tanova portal's media library —
    // hero_url/gallery_urls in the API response, not local /public files.
    remotePatterns: [
      { protocol: "https", hostname: "portal.tsokatravel.com" },
      { protocol: "https", hostname: "portal.mauly-tours.com" },
      { protocol: "https", hostname: "tanovaapp.com" },
    ],
  },
};

export default nextConfig;
