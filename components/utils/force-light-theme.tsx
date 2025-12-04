'use client'

export function ForceLightTheme() {
  const FLAG = process.env.NEXT_PUBLIC_FORCE_LIGHT_THEME

  if (FLAG === 'false') return null

  try {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark')
      document.body?.classList.remove('dark')
    }
    if (typeof localStorage !== 'undefined') {
      const keys = ['theme', 'fd-theme', 'fumadocs-theme']
      keys.forEach((k) => {
        try {
          localStorage.removeItem(k)
        } catch {}
      })
      localStorage.setItem('theme', 'light')
    }
    if (typeof window !== 'undefined' && 'cookieStore' in window) {
      type CookieStoreLike = { delete(name: string): Promise<void> }
      const cookieStore = (
        window as unknown as { cookieStore?: CookieStoreLike }
      ).cookieStore
      if (cookieStore) {
        const cookieNames = ['theme', 'fd-theme', 'fumadocs-theme']
        cookieNames.forEach((name: string) => {
          try {
            cookieStore.delete(name)
          } catch {}
        })
      }
    }
  } catch {}

  return null
}

// TODO(TEN-UI-142): Temporary light-only mode via NEXT_PUBLIC_FORCE_LIGHT_THEME.
// Re-enable dark theme after redesign & QA by setting the flag to 'false'.
