import { createNavigation } from 'next-intl/navigation'
import { nextIntlRouting } from '@/lib/i18n'

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(nextIntlRouting)
