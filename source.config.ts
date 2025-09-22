import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config'
import {
  rehypeCodeDefaultOptions,
  remarkSteps,
} from 'fumadocs-core/mdx-plugins'
import { z } from 'zod'

// Casting to `any` avoids TS's deep instantiation errors with the extended shape.
const docFrontmatterSchema = (frontmatterSchema as any).extend({
  description: z.string().optional(),
  index: z.boolean().default(false),
  preview: z.string().optional(),
}) as z.ZodTypeAny

// Same cast rationale as above; the extended schema blows up the TS checker otherwise.
const docMetaSchema = (metaSchema as any).extend({
  description: z.string().optional(),
}) as z.ZodTypeAny

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docFrontmatterSchema,
  } as const,
  meta: {
    schema: docMetaSchema,
  } as const,
})

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    // Disable remote image size fetching to prevent build/network failures
    remarkImageOptions: false,
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      lazy: true,
      experimentalJSEngine: true,
      inline: 'tailing-curly-colon',
    },
    remarkPlugins: [remarkSteps],
    rehypePlugins: [],
  },
})

// https://fumadocs.vercel.app/blog/make-a-blog
const blogFrontmatterSchema = (frontmatterSchema as any).extend({
  author: z.string(),
  date: z.coerce.date(),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  accentColor: z.string().optional(),
  featuredLabel: z.string().optional(),
  articleLabel: z.string().optional(),
}) as z.ZodTypeAny

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: blogFrontmatterSchema,
})
