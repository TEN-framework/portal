import { createMDX } from 'fumadocs-mdx/next'
import createNextIntlPlugin from 'next-intl/plugin'

const withMDX = createMDX()
const withNextIntl = createNextIntlPlugin('./lib/next-intl-requests.ts')

/** @type {import('next').NextConfig} */
const config = {
  turbopack: true,
  images: {
    domains: ['ten-framework-assets.s3.amazonaws.com'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Optimize build performance
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {
      memoryLimit: 512,
    },
  },
}

export default withNextIntl(withMDX(config))
