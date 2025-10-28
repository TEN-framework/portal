import { createMDX } from 'fumadocs-mdx/next'
import createNextIntlPlugin from 'next-intl/plugin'

const withMDX = createMDX()
const withNextIntl = createNextIntlPlugin('./lib/next-intl-requests.ts')

/** @type {import('next').NextConfig} */
const config = {
  turbopack: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ten-framework-assets.s3.amazonaws.com',
        port: '',
        pathname: '/**'
      }
    ],
    // unoptimized: process.env.NODE_ENV === 'development'
  }
}

export default withNextIntl(withMDX(config))
