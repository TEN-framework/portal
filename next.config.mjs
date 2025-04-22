import { createMDX } from 'fumadocs-mdx/next'
import createNextIntlPlugin from 'next-intl/plugin'

const withMDX = createMDX()
const withNextIntl = createNextIntlPlugin('./lib/next-intl-requests.ts')

/** @type {import('next').NextConfig} */
const config = {
  turbopack: true,
}

export default withNextIntl(withMDX(config))
