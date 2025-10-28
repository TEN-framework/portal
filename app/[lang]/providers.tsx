'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'
import type { ComponentProps } from 'react'

export function LocaleProviders(props: ComponentProps<typeof RootProvider>) {
  const { i18n, ...rest } = props

  return <RootProvider {...rest} i18n={i18n} />
}
