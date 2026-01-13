import NextLink from 'next/link'
import { type BlogCategory, blogCategories } from '@/lib/blog-categories'
import { cn } from '@/lib/utils'

type CategoryTabsProps = {
  activeCategory: BlogCategory | 'all'
  locale: string
  translations: {
    all: string
    releases: string
    tutorials: string
    community: string
    events: string
  }
}

const categories = ['all', ...blogCategories] as const

export function CategoryTabs({
  activeCategory,
  locale,
  translations
}: CategoryTabsProps) {
  const basePath = locale === 'cn' ? '/cn/blog' : '/blog'

  return (
    <nav className='flex flex-wrap items-center gap-2'>
      {categories.map((category) => {
        const isActive = category === activeCategory
        const href =
          category === 'all' ? basePath : `${basePath}?category=${category}`
        const label = translations[category]

        return (
          <NextLink
            key={category}
            href={href}
            className={cn(
              'rounded-full px-4 py-1.5 font-medium text-sm transition-colors duration-200',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {label}
          </NextLink>
        )
      })}
    </nav>
  )
}
