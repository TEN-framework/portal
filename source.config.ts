import {
  rehypeCodeDefaultOptions,
  remarkSteps
} from 'fumadocs-core/mdx-plugins'
import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema
} from 'fumadocs-mdx/config'
import { z } from 'zod'

// Casting to `any` avoids TS's deep instantiation errors with the extended shape.
const docFrontmatterSchema = frontmatterSchema.extend({
  description: z.string().optional(),
  index: z.boolean().default(false),
  preview: z.string().optional()
})

// Same cast rationale as above; the extended schema blows up the TS checker otherwise.
const docMetaSchema = metaSchema.extend({
  description: z.string().optional()
})

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docFrontmatterSchema
  } as const,
  meta: {
    schema: docMetaSchema
  } as const
})

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    // Disable remote image size fetching to prevent build/network failures
    remarkImageOptions: false,
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      lazy: true,
      inline: 'tailing-curly-colon'
    },
    remarkPlugins: [remarkSteps],
    rehypePlugins: []
  }
})

// https://fumadocs.vercel.app/blog/make-a-blog
const blogFrontmatterSchema = frontmatterSchema.extend({
  author: z.string(),
  date: z.coerce.date(),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  accentColor: z.string().optional(),
  accentWords: z.union([z.string(), z.array(z.string())]).optional(),
  featuredLabel: z.string().optional(),
  articleLabel: z.string().optional()
})

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: blogFrontmatterSchema
})
