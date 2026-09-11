import { useEffect, useState } from 'react'
import { BoltIcon, CheckIcon, LockIcon } from '../ui/Icons'
import type { Module, ModuleStatus } from '../../types'

interface ModuleNodeProps {
  module: Module
  status: ModuleStatus
  /** The single module the learner should open next, across the whole course. */
  isNext: boolean
  onOpen: () => void
}

export const NODE_SIZE = 72

/**
 * The root sits exactly NODE_SIZE square so the path can place it by centre
 * point; the caption and "Start" pill hang outside it and never shift the
 * circle off the connector.
 */
export function ModuleNode({ module, status, isNext, onOpen }: ModuleNodeProps) {
  // Locked nodes stay tappable so a nudge can explain why nothing happened.
  const [nudged, setNudged] = useState(false)

  useEffect(() => {
    if (!nudged) return
    const timer = setTimeout(() => setNudged(false), 2200)
    return () => clearTimeout(timer)
  }, [nudged])

  const locked = status === 'locked'

  const surface = {
    completed:
      'bg-[var(--accent)] text-black border-transparent shadow-[0_12px_32px_-12px_color-mix(in_srgb,var(--accent)_70%,transparent)]',
    available:
      'bg-elevated text-[var(--accent)] border-[var(--accent)] shadow-[0_12px_32px_-14px_color-mix(in_srgb,var(--accent)_60%,transparent)]',
    locked: 'bg-surface text-faint border-hairline',
  }[status]

  return (
    <div className="relative" style={{ width: NODE_SIZE, height: NODE_SIZE }}>
      {isNext && (
        <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 animate-pop rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-black uppercase">
          Start
        </span>
      )}

      {isNext && (
        <span
          aria-hidden
          className="absolute inset-0 animate-halo rounded-full bg-[var(--accent)]/40"
        />
      )}

      <button
        type="button"
        onClick={() => (locked ? setNudged(true) : onOpen())}
        aria-disabled={locked}
        aria-label={`${module.title}. ${module.subtitle}. ${status}`}
        className={`relative flex size-full items-center justify-center rounded-full border-2 transition-all duration-200 ease-out sheen ${surface} ${
          locked ? 'hover:border-hairline-strong' : 'hover:scale-105 active:scale-95'
        } ${nudged ? 'animate-shake' : ''}`}
      >
        {status === 'completed' && <CheckIcon className="size-8" />}
        {status === 'available' && <BoltIcon className="size-7" />}
        {status === 'locked' && <LockIcon className="size-6" />}
      </button>

      <p
        className={`absolute top-full left-1/2 mt-2.5 w-[128px] -translate-x-1/2 text-center text-[12px] leading-tight font-medium transition-colors ${
          nudged ? 'text-muted' : locked ? 'text-faint' : 'text-ink'
        }`}
      >
        {nudged ? 'Finish the module before this one' : module.title}
      </p>
    </div>
  )
}
