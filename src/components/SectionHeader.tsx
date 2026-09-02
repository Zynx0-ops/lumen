import { ProgressBar } from './ui/ProgressBar'
import { LockIcon } from './ui/Icons'
import type { Tally } from '../lib/progress'
import type { Section } from '../types'

interface SectionHeaderProps {
  section: Section
  index: number
  tally: Tally
  /** No module in this section is reachable yet. */
  locked: boolean
}

export function SectionHeader({
  section,
  index,
  tally,
  locked,
}: SectionHeaderProps) {
  const finished = tally.done === tally.total

  return (
    <header
      className={`rounded-card border border-hairline bg-elevated p-5 transition-opacity duration-300 sheen sm:p-6 ${
        locked ? 'opacity-55' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[11px] font-semibold tracking-widest text-[var(--accent)] uppercase">
            Section {index + 1}
          </span>
          <h2 className="text-[24px] leading-tight font-semibold text-ink sm:text-[27px]">
            {section.title}
          </h2>
        </div>

        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium tabular-nums ${
            finished
              ? 'border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]'
              : 'border-hairline text-muted'
          }`}
        >
          {locked && <LockIcon className="size-3.5" />}
          {tally.done}/{tally.total}
        </span>
      </div>

      <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
        {section.subtitle}
      </p>

      <ProgressBar
        ratio={tally.ratio}
        className="mt-5"
        label={`${section.title} progress`}
      />
    </header>
  )
}
