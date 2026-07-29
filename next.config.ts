import type { NextConfig } from "next";

const basePath =
  process.env.PAGES_URL && process.env.PAGES_URL !== "/"
    ? process.env.PAGES_URL.replace(/\/$/, "")
    : "";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  reactCompiler: true,
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  basePath,
};

export default nextConfig;
