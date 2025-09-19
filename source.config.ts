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

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      description: z.string().optional(),
      index: z.boolean().default(false),
      preview: z.string().optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
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
export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.coerce.date(),
  }),
})
