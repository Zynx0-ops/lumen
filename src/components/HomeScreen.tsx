import { useMemo } from 'react'
import { CardsHome } from './cards/CardsHome'
import { CardsSidebar } from './cards/CardsSidebar'
import { LearnPath } from './learn/LearnPath'
import { LearnSidebar } from './learn/LearnSidebar'
import type { PathEntry } from './learn/ModulePath'
import { UpNextDock } from './learn/UpNextDock'
import { AppShell } from './shell/AppShell'
import type { Tab } from './shell/Tabs'
import { ProgressBar } from './ui/ProgressBar'
import { ResetButton } from './ui/ResetButton'
import { courseTally, flattenModules, nextModule, statusOf } from '../lib/progress'
import type { CardSet } from '../lib/sets'
import { readCompleted } from '../lib/storage'
import { learnedDeck, type Deck } from '../lib/vocab'
import type { Course, Module, Section } from '../types'

interface HomeScreenProps {
  course: Course
  courses: Course[]
  completed: ReadonlySet<string>
  /** This course's flashcard sets. */
  sets: CardSet[]
  tab: Tab
  onTab: (tab: Tab) => void
  onSelectCourse: (courseId: string) => void
  onOpenModule: (section: Section, module: Module) => void
  onReset: () => void
  onStudy: (deck: Deck) => void
  onNewSet: () => void
  onEditSet: (setId: string) => void
  onShareSet: (setId: string) => void
  onImport: () => void
}

/** Both tabs inside the shared shell, each filling the slots it needs. */
export function HomeScreen(props: HomeScreenProps) {
  const { course, courses, completed, sets, tab } = props

  const refs = flattenModules(course)
  const next = nextModule(refs, completed)
  const overall = courseTally(course, completed)
  // Chrome takes its hue from wherever the learner currently is.
  const accent = next?.section.accent ?? course.sections.at(-1)?.accent ?? 'mint'

  const entries = new Map<string, PathEntry>()
  refs.forEach((ref, index) => {
    entries.set(ref.module.id, {
      module: ref.module,
      status: statusOf(refs, completed, index),
      isNext: next?.module.id === ref.module.id,
    })
  })

  // The picker shows progress for every language; inactive ones come from storage.
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
    if (next) props.onOpenModule(next.section, next.module)
  }

  const shell = {
    course,
    courses,
    tallies,
    onSelectCourse: props.onSelectCourse,
    tab,
    onTab: props.onTab,
    accent,
  }

  if (tab === 'cards') {
    const learnedCount = learnedDeck(course, completed).cards.length
    return (
      <AppShell
        {...shell}
        sidebar={
          <CardsSidebar
            learnedCount={learnedCount}
            setCount={sets.length}
            onNewSet={props.onNewSet}
            onImport={props.onImport}
          />
        }
        header={
          <div className="flex min-w-0 flex-col">
            <span className="text-[14px] font-semibold text-ink">Flashcards</span>
            <span className="truncate text-[12px] text-faint">
              {learnedCount} words learned · {sets.length}{' '}
              {sets.length === 1 ? 'set' : 'sets'}
            </span>
          </div>
        }
      >
        <CardsHome
          course={course}
          completed={completed}
          sets={sets}
          onStudy={props.onStudy}
          onNewSet={props.onNewSet}
          onEditSet={props.onEditSet}
          onShareSet={props.onShareSet}
          onImport={props.onImport}
        />
      </AppShell>
    )
  }

  return (
    <AppShell
      {...shell}
      sidebar={
        <LearnSidebar
          course={course}
          completed={completed}
          next={next}
          onContinue={openNext}
          onReset={props.onReset}
        />
      }
      header={
        <>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[14px] font-semibold text-ink">{course.language}</span>
              <span className="text-[12px] tabular-nums text-faint">
                {overall.done}/{overall.total} modules
              </span>
            </div>
            <ProgressBar ratio={overall.ratio} label="Course progress" />
          </div>
          <ResetButton onReset={props.onReset} compact />
        </>
      }
      dock={
        next ? (
          <UpNextDock next={next} started={overall.done > 0} onContinue={openNext} />
        ) : undefined
      }
    >
      <LearnPath
        course={course}
        completed={completed}
        entries={entries}
        finished={!next}
        onOpenModule={props.onOpenModule}
      />
    </AppShell>
  )
}
