'use client'

import { Check, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'

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
    <div className='mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
      <div className='flex items-center justify-between border-slate-100 border-b bg-slate-50 px-4 py-2'>
        <div className='flex items-center gap-2 text-slate-500'>
          <Terminal className='h-4 w-4' strokeWidth={1.8} />
          <span className='font-semibold text-slate-600 text-sm'>终端</span>
        </div>
        <button
          onClick={onCopy}
          type='button'
          className='inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-[11px] text-slate-500 transition hover:bg-slate-100'
          aria-live='polite'
          aria-label='复制代码'
        >
          {copied ? (
            <>
              <Check className='h-3.5 w-3.5 text-emerald-600' />
              <span className='text-emerald-700'>已复制</span>
            </>
          ) : (
            <>
              <Copy className='h-3.5 w-3.5' />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre className='guide-code overflow-auto bg-white px-4 py-4 text-sm leading-relaxed'>
        <code className='whitespace-pre'>{code}</code>
      </pre>
    </div>
  )
}
