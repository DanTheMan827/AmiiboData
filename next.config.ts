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
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
