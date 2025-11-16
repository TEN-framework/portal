import type { ReactNode } from "react"

export function InlineCodeText({ text }: { text: string }) {
  const parts = splitInline(text)
  return (
    <span>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : (
          <code key={i} className="guide-code-inline">{p.content}</code>
        )
      )}
    </span>
  )
}

function splitInline(input: string): (string | { content: string })[] {
  const out: (string | { content: string })[] = []
  let rest = input
  while (rest.includes("`")) {
    const start = rest.indexOf("`")
    if (start === -1) break
    const afterStart = rest.slice(start + 1)
    const end = afterStart.indexOf("`")
    if (end === -1) break
    const before = rest.slice(0, start)
    if (before) out.push(before)
    const code = afterStart.slice(0, end)
    out.push({ content: code })
    rest = afterStart.slice(end + 1)
  }
  if (rest) out.push(rest)
  return out
}