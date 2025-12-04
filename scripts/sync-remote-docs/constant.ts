import { frontmatterSchema } from 'fumadocs-mdx/config'
import * as z from 'zod'

export const IDENTIFIER_ROOT = '[sync-remote-docs]'

export const MAX_LOCAL_VERSION_COUNT = 3

// Relative path to the root of the ten-framework repository
export const DEFAULT_REMOTE_DOCS_FOLDER = 'docs'
export const DEFAULT_DOC_CONFIG_FILENAME = `_portal_config.json`
export const PortalConfig = z.looseObject({
  matcher: z
    .array(z.string())
    // Use regex patterns: allow .md/.mdx anywhere, disallow paths starting with README- or under code-of-conduct/
    .default([
      '^.*\\.mdx?$', // allow all .md or .mdx files
      '^(?!README-).*', // disallow files starting with README-
      '^(?!code-of-conduct/).*' // disallow files under code-of-conduct/
    ])
})
export type PortalConfig = z.infer<typeof PortalConfig>

export const DEFAULT_LOCAL_DOCS_RELATIVE_PATH = [
  'content',
  'docs',
  'ten_framework'
]
export const DEFAULT_LOCAL_LATEST_DOCS_RELATIVE_PATH = [
  ...DEFAULT_LOCAL_DOCS_RELATIVE_PATH,
  '(latest)'
]
export const DEFAULT_LOCAL_VERSION_JSON_RELATIVE_PATH = [
  ...DEFAULT_LOCAL_DOCS_RELATIVE_PATH,
  '_version.json'
]

export const LocalVersionJson = z.object({
  latest: z.string(),
  versions: z.array(z.string())
})
export type LocalVersionJson = z.infer<typeof LocalVersionJson>

export enum FileAction {
  ADD = 'add',
  DELETE = 'delete',
  MODIFY = 'modify',
  RENAME = 'rename'
}

export const DiffJson = z.object({
  added_files: z.array(z.string()),
  deleted_files: z.array(z.string()),
  modified_files: z.array(z.string()),
  renamed_files: z.array(z.string())
})
export type DiffJson = z.infer<typeof DiffJson>

export const RemoteDocFrontmatter = frontmatterSchema.extend({
  _portal_target: z.string().meta({
    description:
      'Target path of the remote docs, relative to the /content/docs/ten_framework/(latest) directory',
    examples: ['/api/api.md', '/development/development.cn.md']
  })
})
export type RemoteDocFrontmatter = z.infer<typeof RemoteDocFrontmatter>

export const MetaJson = z.object({
  title: z.string(),
  description: z.string(),
  root: z.boolean().optional(),
  pages: z.array(z.string()).optional()
})
export type MetaJson = z.infer<typeof MetaJson>
