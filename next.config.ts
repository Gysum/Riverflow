import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;