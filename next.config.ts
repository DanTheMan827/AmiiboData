import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  reactCompiler: true,
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  },
};

export default nextConfig;
