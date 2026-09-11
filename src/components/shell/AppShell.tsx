import type { ReactNode } from 'react'
import { TabBar, TabNav, type Tab } from './Tabs'
import { CoursePicker } from '../CoursePicker'
import { accentVars } from '../../lib/accent'
import type { Tally } from '../../lib/progress'
import type { AccentName, Course } from '../../types'

interface AppShellProps {
  course: Course
  courses: Course[]
  tallies: Map<string, Tally>
  onSelectCourse: (courseId: string) => void
  tab: Tab
  onTab: (tab: Tab) => void
  accent: AccentName
  /** Desktop sidebar content, below the picker and tabs. */
  sidebar: ReactNode
  /** Mobile header content, beside the picker. */
  header: ReactNode
  /** Mobile only: rides above the tab bar, like a mini player. */
  dock?: ReactNode
  children: ReactNode
}

/**
 * The frame both tabs share. Desktop gets a sticky sidebar; phones get a
 * compact header, and a tab bar with an optional dock above it.
 */
export function AppShell({
  course,
  courses,
  tallies,
  onSelectCourse,
  tab,
  onTab,
  accent,
  sidebar,
  header,
  dock,
  children,
}: AppShellProps) {
  const picker = (compact: boolean) => (
    <CoursePicker
      courses={courses}
      active={course}
      tallies={tallies}
      onSelect={onSelectCourse}
      compact={compact}
    />
  )

  return (
    <div className="min-h-dvh bg-canvas" style={accentVars(accent)}>
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          {picker(true)}
          <div className="flex min-w-0 flex-1 items-center gap-2">{header}</div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl gap-12 px-4 sm:px-6 lg:px-8">
        <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col gap-6 overflow-y-auto py-10 lg:flex">
          {picker(false)}
          <TabNav tab={tab} onTab={onTab} />
          {sidebar}
        </aside>

        <main
          className={`min-w-0 flex-1 pt-8 lg:py-14 ${dock ? 'pb-44' : 'pb-28'}`}
        >
          {children}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas/85 backdrop-blur-xl lg:hidden">
        {dock}
        <TabBar tab={tab} onTab={onTab} />
      </div>
    </div>
  )
}
