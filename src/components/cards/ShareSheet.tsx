import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { CopyIcon, ShareIcon } from '../ui/Icons'
import { Sheet } from '../ui/Sheet'
import { encodeSet, isLocalOnly, shareLink } from '../../lib/share'
import type { CardSet } from '../../lib/sets'

interface ShareSheetProps {
  set: CardSet
  language: string
  onClose: () => void
}

type Copied = 'link' | 'code' | 'manual' | null

export function ShareSheet({ set, language, onClose }: ShareSheetProps) {
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState<Copied>(null)
  const linkField = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    let live = true
    encodeSet({ courseId: set.courseId, name: set.name, cards: set.cards }).then(
      (encoded) => live && setCode(encoded),
    )
    return () => {
      live = false
      window.clearTimeout(timer.current)
    }
  }, [set])

  const link = code ? shareLink(code) : ''
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  async function copy(text: string, which: 'link' | 'code') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
    } catch {
      // No clipboard permission: select the link so a keyboard copy works.
      linkField.current?.select()
      setCopied('manual')
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(null), 2000)
  }

  async function nativeShare() {
    try {
      await navigator.share({
        title: `${set.name} — Lumen flashcards`,
        text: `${set.cards.length} ${language} flashcards`,
        url: link,
      })
    } catch {
      // Dismissing the share sheet rejects; nothing to do.
    }
  }

  return (
    <Sheet title="Share set" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-hairline bg-raised p-4">
          <p className="truncate text-[16px] font-semibold text-ink">{set.name}</p>
          <p className="text-[13px] text-muted">
            {language} · {set.cards.length} {set.cards.length === 1 ? 'card' : 'cards'}
          </p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium tracking-widest text-faint uppercase">
            Link
          </span>
          <input
            ref={linkField}
            readOnly
            value={code ? link : 'Preparing link…'}
            onFocus={(e) => e.target.select()}
            className="w-full truncate rounded-xl border border-hairline bg-canvas px-3.5 py-3 font-mono text-[13px] text-muted outline-none focus:border-[var(--accent)]"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="accent" size="sm" disabled={!code} onClick={() => copy(link, 'link')}>
            <CopyIcon className="size-4" />
            {copied === 'link' ? 'Copied' : 'Copy link'}
          </Button>
          <Button variant="neutral" size="sm" disabled={!code} onClick={() => code && copy(code, 'code')}>
            {copied === 'code' ? 'Copied' : 'Copy code'}
          </Button>
        </div>

        {canShare && (
          <Button variant="neutral" block disabled={!code} onClick={nativeShare}>
            <ShareIcon className="size-4" />
            Share…
          </Button>
        )}

        {copied === 'manual' && (
          <p className="text-[13px] text-[#ff9f0a]">
            Couldn’t reach the clipboard — the link is selected, so press ⌘C or Ctrl+C.
          </p>
        )}

        <p className="text-[13px] leading-relaxed text-faint">
          {isLocalOnly()
            ? 'Lumen is running on this computer, so the link only opens here. Send the code instead — a friend running Lumen can paste it into Import.'
            : 'Anyone with the link gets their own copy. Nothing is uploaded — the whole set travels inside the link.'}
        </p>
      </div>
    </Sheet>
  )
}
