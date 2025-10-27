export function WebsiteStructuredData() {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'TEN Framework',
          url: 'https://theten.ai',
          description:
            'TEN is an open-source framework designed for building multimodal conversational AI with real-time capabilities.',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://theten.ai/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        })
      }}
    />
  )
}

export function OrganizationStructuredData() {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'TEN Framework',
          url: 'https://theten.ai',
          logo: 'https://theten.ai/logo.png',
          sameAs: [
            'https://twitter.com/TenFramework',
            'https://www.linkedin.com/company/ten-framework',
            'https://discord.gg/VnPftUzAMJ',
            'https://huggingface.co/TEN-framework'
          ]
        })
      }}
    />
  )
}
