import {
  type FileObject,
  printErrors,
  scanURLs,
  validateFiles,
} from 'next-validate-link'
import type { InferPageType } from 'fumadocs-core/source'
import { source } from '@/.source'

async function checkLinks() {
  const scanned = await scanURLs({
    preset: 'next',
    populate: {
      'docs/[[...slug]]': source.getPages().map(toPopulateEntry),
    },
  })

  const result = await validateFiles(source.getPages().map(toFile), {
    scanned,
    markdown: {
      components: {
        Card: { attributes: ['href'] },
      },
    },
    checkRelativePaths: 'as-url',
  })

  printErrors(result, true)
}

function toPopulateEntry(page: InferPageType<typeof source>) {
  return {
    value: {
      slug: page.slugs,
    },
    hashes: getHeadingHashes(page),
  }
}

function getHeadingHashes(page: InferPageType<typeof source>) {
  return page.data.toc.map((item) => item.url.slice(1))
}

function toFile(page: InferPageType<typeof source>): FileObject {
  return {
    data: page.data,
    url: page.url,
    path: page.absolutePath,
    content: page.data.content,
  }
}

void checkLinks()
