import { fileURLToPath } from "url";
import { dirname } from "path";
import { createMDX } from "fumadocs-mdx/next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js treats this folder as the root for file tracing
  outputFileTracingRoot: __dirname,
};

const withMDX = createMDX();
export default withMDX(nextConfig);
