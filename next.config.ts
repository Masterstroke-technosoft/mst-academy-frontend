import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/1.png",
      },
    ];
  },
};

export default nextConfig;
