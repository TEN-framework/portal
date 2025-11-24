import type { ComponentType } from 'react'

type MDXModule = {
  frontmatter: Record<string, unknown>
  metadata: Record<string, unknown>
  default: ComponentType<Record<string, unknown>>
}

declare module '*.mdx?collection=blogPosts' {
  const mod: MDXModule
  export const frontmatter: MDXModule['frontmatter']
  export const metadata: MDXModule['metadata']
  export default mod.default
}

declare module '*.mdx?collection=docs' {
  const mod: MDXModule
  export const frontmatter: MDXModule['frontmatter']
  export const metadata: MDXModule['metadata']
  export default mod.default
}

declare module '*.md?collection=docs' {
  const mod: MDXModule
  export const frontmatter: MDXModule['frontmatter']
  export const metadata: MDXModule['metadata']
  export default mod.default
}
