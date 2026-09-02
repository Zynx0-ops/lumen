import { useEffect, useState } from 'react'
import { UndoIcon } from './Icons'

interface ResetButtonProps {
  onReset: () => void
  /** Icon-only, for the mobile header. */
  compact?: boolean
}

/**
 * Two-step confirm rather than a modal: the first press arms the button, the
 * second clears progress, and it disarms itself after a few seconds.
 */
export function ResetButton({ onReset, compact = false }: ResetButtonProps) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const timer = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(timer)
  }, [armed])

  function press() {
    if (armed) {
      onReset()
      setArmed(false)
    } else {
      setArmed(true)
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={press}
        aria-label={armed ? 'Confirm reset progress' : 'Reset progress'}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
          armed ? 'bg-wrong/15 text-wrong' : 'text-faint hover:text-muted'
        }`}
      >
        <UndoIcon className="size-4" />
        {armed && <span>Sure?</span>}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={press}
      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-medium transition-colors ${
        armed
          ? 'bg-wrong/12 text-wrong'
          : 'text-faint hover:bg-white/5 hover:text-muted'
      }`}
    >
      <UndoIcon className="size-4" />
      {armed ? 'Tap again to erase progress' : 'Reset progress'}
    </button>
  )
}
