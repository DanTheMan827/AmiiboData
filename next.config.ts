import type { NextConfig } from "next";

const basePath =
  process.env.PAGES_URL && process.env.PAGES_URL !== "/"
    ? process.env.PAGES_URL.replace(/\/$/, "")
    : "";

const output = process.env.NEXT_OUTPUT ?? "standalone";

console.log(`Next.js output mode: ${output}`);

const nextConfig: NextConfig = {
  cleanDistDir: true,
  reactCompiler: true,
  output: output as "export" | "standalone",
  images: {
    unoptimized: true
  },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
