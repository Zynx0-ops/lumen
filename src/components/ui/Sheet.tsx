import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { CloseIcon } from './Icons'

interface SheetProps {
  title: string
  onClose: () => void
  children: ReactNode
  /** Pinned below the scrolling body — usually the primary action. */
  footer?: ReactNode
}

/**
 * A modal panel: a bottom sheet on phones, a centred card on wider screens.
 * Escape, the backdrop and the close button all dismiss it, and focus returns
 * to whatever opened it.
 */
export function Sheet({ title, onClose, children, footer }: SheetProps) {
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)
  // Captured during the first render, before anything inside takes focus.
  const [opener] = useState(() => document.activeElement as HTMLElement | null)
  // The latest onClose, so a parent passing a fresh function doesn't re-run
  // the mount effect below and yank focus around.
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Leave focus alone if a field inside already claimed it via autoFocus.
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      opener?.focus?.()
    }
  }, [opener])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden
        onClick={() => close.current()}
        className="absolute inset-0 animate-fade bg-black/65 backdrop-blur-sm"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[88dvh] w-full animate-sheet flex-col overflow-hidden rounded-t-[28px] border border-hairline-strong bg-elevated shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.9)] outline-none sm:max-w-md sm:rounded-[28px]"
      >
        <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-3">
          <h2 id={titleId} className="text-[18px] font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => close.current()}
            aria-label="Close"
            className="-mr-1.5 rounded-full p-1.5 text-faint transition-colors hover:bg-white/5 hover:text-ink"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
        {footer && (
          <div className="border-t border-hairline px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
