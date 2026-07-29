import type { NextConfig } from "next";

const basePath =
  process.env.PAGES_URL && process.env.PAGES_URL !== "/"
    ? process.env.PAGES_URL.replace(/\/$/, "")
    : "";

const output = process.env.NEXT_OUTPUT ?? "export";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  reactCompiler: true,
  output: output as "export" | "standalone",
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
