"use client"

import { useState } from "react"

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }
  return (
    <div className="relative">
      <pre className="guide-code mt-4 overflow-auto rounded-2xl p-4 text-sm">
        <code className="whitespace-pre">{code}</code>
      </pre>
      <button
        onClick={onCopy}
        className="absolute right-3 top-3 guide-cta-secondary rounded-full px-3 py-1 text-xs"
        aria-live="polite"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  )
}