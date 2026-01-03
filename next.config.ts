import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  // Produce standalone output for self-hosted deploys (Docker or zipped bundle)
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  // Disable Next.js image optimization to avoid bundling native image deps (e.g., sharp)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
