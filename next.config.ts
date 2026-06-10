import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yisvqdlpvftflntwzuhg.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'uptowntrading.co.th',
      },
      {
        protocol: 'https',
        hostname: 'highsostore.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
