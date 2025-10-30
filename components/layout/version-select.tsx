'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { getVersionFromPathname, sortVersions } from '@/components/layout/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import TEN_FRAMEWORK_VERSIONS from '@/content/docs/ten_framework/_version.json'
import TEN_FRAMEWORK_META from '@/content/docs/ten_framework/(latest)/meta.json'
import { cn } from '@/lib/utils'

export const VersionSelector = () => {
  return (
    <React.Suspense fallback={null}>
      <TenFrameworkVersionSelectorDynamic />
    </React.Suspense>
  )
}

const TenFrameworkVersionSelectorTitle = TEN_FRAMEWORK_META?.title
const TenFrameworkVersionSelectorDynamic = (props: { className?: string }) => {
  const { className } = props
  const [selectedVersion, setSelectedVersion] = React.useState<string>('latest')

  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('components.version-select')

  // notice: productVersion is version string without prefix 'v'
  const [productName, productVersion, restPath, prefixPath] =
    React.useMemo(() => {
      const productName = pathname?.split('/docs/')?.[1]?.split('/')?.[0] ?? ''
      const productVersion = getVersionFromPathname(pathname, productName) ?? ''
      const restPath =
        pathname?.split(
          `/${productName}${productVersion ? `/v${productVersion}` : ''}/`
        )?.[1] ?? ''
      const prefixPath = pathname?.split(`/${productName}/`)?.[0] ?? ''
      return [productName, productVersion, restPath, prefixPath]
    }, [pathname])

  console.log('productName', productName)
  console.log('productVersion', productVersion)
  console.log('restPath', restPath)
  console.log('prefixPath', prefixPath)

  // notice: sortedVersions item has no prefix 'v'
  const sortedVersions = React.useMemo(() => {
    const latestVersion = TEN_FRAMEWORK_VERSIONS.latest
    const restVsersions = TEN_FRAMEWORK_VERSIONS.versions.filter(
      (version) => version !== latestVersion
    )
    return sortVersions(restVsersions, { sort: 'desc' })
  }, [])

  const handleVersionChange = (value: string) => {
    if (value === 'latest') {
      router.push(`${prefixPath}/${productName}/${restPath}`)
    } else {
      router.push(`${prefixPath}/${productName}/v${value}/${restPath}`)
    }
  }

  React.useEffect(() => {
    if (productName !== 'ten_framework') return
    if (!productVersion) return setSelectedVersion('latest')
    setSelectedVersion(productVersion)
  }, [productName, productVersion])

  if (productName !== 'ten_framework') return null

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {selectedVersion !== 'latest' && (
        <div>{TenFrameworkVersionSelectorTitle || productName}</div>
      )}
      <Select onValueChange={handleVersionChange} value={selectedVersion}>
        <SelectTrigger className='w-full bg-fd-secondary/50 text-fd-secondary-foreground hover:bg-fd-accent data-[state=open]:bg-fd-accent'>
          <SelectValue placeholder={t('placeholder')} />
        </SelectTrigger>
        <SelectContent className=''>
          <SelectGroup>
            <SelectLabel>{t('label')}</SelectLabel>
            <SelectItem value='latest'>
              {`${t('latest')} (${TEN_FRAMEWORK_VERSIONS.latest})`}
            </SelectItem>
            {sortedVersions.map((version) => (
              <SelectItem
                key={`select-item-${productName}-${version}`}
                value={version}
                disabled={version === productVersion}
              >
                {version}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
