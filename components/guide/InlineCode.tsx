export function InlineCodeText({ text }: { text: string }) {
  const parts = splitInline(text)
  return (
    <span>
      {parts.map((part, index) => {
        const key =
          typeof part === 'string'
            ? `text-${index}-${part}`
            : `code-${index}-${part.content}`
        return typeof part === 'string' ? (
          <span key={key}>{part}</span>
        ) : (
          <code key={key} className='guide-code-inline'>
            {part.content}
          </code>
        )
      })}
    </span>
  )
}

function splitInline(input: string): Array<string | { content: string }> {
  const chunks: Array<string | { content: string }> = []
  let rest = input

  while (rest.includes('`')) {
    const start = rest.indexOf('`')
    if (start === -1) break
    const afterStart = rest.slice(start + 1)
    const end = afterStart.indexOf('`')
    if (end === -1) break

    const before = rest.slice(0, start)
    if (before) chunks.push(before)

    const code = afterStart.slice(0, end)
    chunks.push({ content: code })

    rest = afterStart.slice(end + 1)
  }

  if (rest) chunks.push(rest)
  return chunks
}
