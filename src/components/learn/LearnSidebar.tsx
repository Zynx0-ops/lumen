import { Button } from '../ui/Button'
import { ChevronIcon } from '../ui/Icons'
import { ProgressBar } from '../ui/ProgressBar'
import { ResetButton } from '../ui/ResetButton'
import { courseTally, sectionTally, type ModuleRef } from '../../lib/progress'
import { ACCENTS, type Course } from '../../types'

interface LearnSidebarProps {
  course: Course
  completed: ReadonlySet<string>
  next: ModuleRef | null
  onContinue: () => void
  onReset: () => void
}

export function LearnSidebar({
  course,
  completed,
  next,
  onContinue,
  onReset,
}: LearnSidebarProps) {
  const overall = courseTally(course, completed)
  const started = overall.done > 0

  function jumpTo(sectionId: string) {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="rounded-card border border-hairline bg-elevated p-5 sheen">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-muted">Course progress</span>
          <span className="text-[26px] font-semibold tabular-nums text-ink">
            {Math.round(overall.ratio * 100)}
            <span className="text-[15px] text-muted">%</span>
          </span>
        </div>
        <ProgressBar
          ratio={overall.ratio}
          className="mt-3.5"
          label="Course progress"
        />
        <p className="mt-3 text-[12px] text-faint">
          {overall.done} of {overall.total} modules complete
        </p>
      </div>

      {next ? (
        <div className="flex flex-col gap-4 rounded-card border border-hairline bg-elevated p-5 sheen">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium tracking-widest text-faint uppercase">
              {started ? 'Up next' : 'Begin here'}
            </span>
            <span className="text-[17px] font-semibold text-ink">
              {next.module.title}
            </span>
            <span className="text-[13px] text-muted">
              {next.module.subtitle}
            </span>
          </div>
          <Button variant="accent" block onClick={onContinue}>
            {started ? 'Continue' : 'Start learning'}
            <ChevronIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="rounded-card border border-[var(--accent)]/30 bg-[var(--accent)]/8 p-5">
          <p className="text-[15px] font-semibold text-[var(--accent)]">
            Course complete
          </p>
          <p className="mt-1.5 text-[13px] text-muted">
            Every module in {course.language} is done.
          </p>
        </div>
      )}

      <nav aria-label="Sections" className="flex flex-col gap-1">
        <p className="px-3 pb-2 text-[11px] font-medium tracking-widest text-faint uppercase">
          Sections
        </p>
        {course.sections.map((section) => {
          const tally = sectionTally(section, completed)
          const isCurrent = next?.section.id === section.id
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpTo(section.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                isCurrent ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: ACCENTS[section.accent],
                  opacity: tally.done > 0 ? 1 : 0.28,
                }}
              />
              <span
                className={`flex-1 truncate text-[14px] font-medium ${
                  isCurrent ? 'text-ink' : 'text-muted'
                }`}
              >
                {section.title}
              </span>
              <span className="text-[12px] tabular-nums text-faint">
                {tally.done}/{tally.total}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto pt-4">
        <ResetButton onReset={onReset} />
      </div>
    </>
  )
}
