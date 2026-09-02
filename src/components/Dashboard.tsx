import { useMemo } from 'react'
import { CoursePicker } from './CoursePicker'
import { CourseSidebar } from './CourseSidebar'
import { ModulePath, type PathEntry } from './ModulePath'
import { SectionHeader } from './SectionHeader'
import { Button } from './ui/Button'
import { ProgressBar } from './ui/ProgressBar'
import { ResetButton } from './ui/ResetButton'
import { ChevronIcon } from './ui/Icons'
import { accentVars } from '../lib/accent'
import {
  courseTally,
  flattenModules,
  isSectionLocked,
  nextModule,
  sectionTally,
  statusOf,
} from '../lib/progress'
import { readCompleted } from '../lib/storage'
import type { Course, Module, Section } from '../types'

interface DashboardProps {
  course: Course
  /** Every course on offer, for the language picker. */
  courses: Course[]
  completed: ReadonlySet<string>
  onSelectCourse: (courseId: string) => void
  onOpenModule: (section: Section, module: Module) => void
  onReset: () => void
}

export function Dashboard({
  course,
  courses,
  completed,
  onSelectCourse,
  onOpenModule,
  onReset,
}: DashboardProps) {
  const refs = flattenModules(course)
  const next = nextModule(refs, completed)
  const overall = courseTally(course, completed)

  // Chrome takes its hue from wherever the learner currently is.
  const accent = next?.section.accent ?? course.sections.at(-1)?.accent ?? 'mint'

  // One pass over the flattened list gives every node its state, keyed by id
  // so each section can pick out its own without recomputing the unlock rule.
  const entries = new Map<string, PathEntry>()
  refs.forEach((ref, index) => {
    entries.set(ref.module.id, {
      module: ref.module,
      status: statusOf(refs, completed, index),
      isNext: next?.module.id === ref.module.id,
    })
  })

  // The picker shows progress for every language, so the inactive ones are
  // read from storage. Recomputed only when the active course's progress moves.
  const tallies = useMemo(
    () =>
      new Map(
        courses.map((c) => [
          c.id,
          courseTally(c, c.id === course.id ? completed : readCompleted(c.id)),
        ]),
      ),
    [courses, course.id, completed],
  )

  function openNext() {
    if (next) onOpenModule(next.section, next.module)
  }

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Mobile chrome — the sidebar's job, condensed into a bar. */}
      <header
        className="sticky top-0 z-30 border-b border-hairline bg-canvas/80 px-4 py-3 backdrop-blur-xl lg:hidden"
        style={accentVars(accent)}
      >
        <div className="flex items-center gap-2">
          <CoursePicker
            courses={courses}
            active={course}
            tallies={tallies}
            onSelect={onSelectCourse}
            compact
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[14px] font-semibold text-ink">
                {course.language}
              </span>
              <span className="text-[12px] tabular-nums text-faint">
                {overall.done}/{overall.total} modules
              </span>
            </div>
            <ProgressBar ratio={overall.ratio} label="Course progress" />
          </div>
          <ResetButton onReset={onReset} compact />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl gap-12 px-4 sm:px-6 lg:px-8">
        <CourseSidebar
          course={course}
          courses={courses}
          completed={completed}
          next={next}
          accent={accent}
          tallies={tallies}
          onSelectCourse={onSelectCourse}
          onContinue={openNext}
          onReset={onReset}
        />

        <main className="min-w-0 flex-1 pt-8 pb-32 lg:py-14">
          <div className="mx-auto flex max-w-md flex-col gap-14">
            {course.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="flex scroll-mt-24 flex-col gap-10"
                style={accentVars(section.accent)}
              >
                <SectionHeader
                  section={section}
                  index={index}
                  tally={sectionTally(section, completed)}
                  locked={isSectionLocked(course, index, completed)}
                />
                <ModulePath
                  section={section}
                  entries={section.modules.map((m) => entries.get(m.id)!)}
                  onOpen={(module) => onOpenModule(section, module)}
                />
              </section>
            ))}

            <p className="pb-4 text-center text-[13px] text-faint">
              {next
                ? 'More sections unlock as you go.'
                : 'You have reached the end of the course.'}
            </p>
          </div>
        </main>
      </div>

      {/* Mobile call to action, mirroring the sidebar's continue card. */}
      {next && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas/85 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
          style={accentVars(accent)}
        >
          <div className="mx-auto flex max-w-md items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] font-medium tracking-widest text-faint uppercase">
                {overall.done > 0 ? 'Up next' : 'Begin here'}
              </span>
              <span className="truncate text-[15px] font-semibold text-ink">
                {next.module.title}
              </span>
            </div>
            <Button variant="accent" onClick={openNext} className="shrink-0">
              {overall.done > 0 ? 'Continue' : 'Start'}
              <ChevronIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
