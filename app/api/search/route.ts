import { createTokenizer } from '@orama/tokenizers/mandarin'
import { createFromSource } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

export const { GET } = createFromSource(source, undefined, {
  localeMap: {
    // you can customise search configs for specific locales, like:
    // [locale]: Orama options

    cn: {
      components: {
        tokenizer: createTokenizer()
      },
      search: {
        threshold: 0,
        tolerance: 0
      }
    },
    en: 'english'
  }
})
