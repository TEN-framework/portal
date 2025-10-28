import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import defaultComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    // biome-ignore lint/suspicious/noExplicitAny: <allow any>
    img: (props) => <ImageZoom width={600} height={400} {...(props as any)} />,
    ...components
  }
}
