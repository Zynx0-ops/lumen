import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import { CheckIcon, FlameIcon } from '../ui/Icons'
import { accentVars } from '../../lib/accent'
import { HEAT_STEPS } from '../../lib/lesson'
import type { Module, Section } from '../../types'

interface LessonSummaryProps {
  section: Section
  module: Module
  total: number
  firstTry: number
  /** Exercises that were missed and then got right on a later try. */
  fixed: number
  bestStreak: number
  onExit: () => void
}

export function LessonSummary({
  section,
  module,
  total,
  firstTry,
  fixed,
  bestStreak,
  onExit,
}: LessonSummaryProps) {
  const onFire = bestStreak >= HEAT_STEPS[0]

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-16"
      style={accentVars(section.accent)}
    >
      <div className="flex w-full max-w-sm animate-rise flex-col items-center gap-9 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 animate-halo rounded-full bg-[var(--accent)]/25" />
          <span className="relative flex size-24 items-center justify-center rounded-full bg-[var(--accent)] text-black">
            <CheckIcon className="size-11" />
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-[30px] font-semibold text-ink">Module complete</h2>
          <p className="text-[16px] text-muted">
            {module.title} · {section.title}
          </p>
        </div>

        <dl className="grid w-full grid-cols-3 gap-2.5">
          <Stat label="First try" value={`${firstTry}/${total}`} />
          <Stat label="Fixed" value={String(fixed)} />
          <Stat
            label="Best streak"
            value={String(bestStreak)}
            icon={onFire ? <FlameIcon className="size-5" /> : undefined}
          />
        </dl>

        <p className="text-[14px] leading-relaxed text-muted">
          {fixed === 0
            ? 'A clean run — nothing needed a second try.'
            : `Every miss came back until you had it — ${fixed} fixed along the way.`}
        </p>

        <Button variant="accent" block onClick={onExit}>
          Back to path
        </Button>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-hairline bg-elevated px-2 py-4 sheen">
      <dd className="flex items-center gap-1 text-[22px] font-semibold tabular-nums text-ink">
        {icon}
        {value}
      </dd>
      <dt className="text-[12px] text-faint">{label}</dt>
    </div>
  )
}
