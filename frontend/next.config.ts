import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.*.*",
    "10.*.*.*",
    ...Array.from({ length: 16 }, (_, index) => `172.${index + 16}.*.*`),
  ],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // The local backend serves uploaded media from localhost during development.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
      },
    ],
  },
  async rewrites() {
    const backendOrigin = (process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
    return [
      {
        source: "/__tixora_api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
