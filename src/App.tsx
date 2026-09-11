import { useCallback, useEffect, useState } from 'react'
import { CourseView } from './components/CourseView'
import type { Tab } from './components/shell/Tabs'
import { useActiveCourse } from './hooks/useActiveCourse'
import { courses as allCourses } from './data/courses'
import { decodeSet, extractCode, type SharedSet } from './lib/share'
import type { Course } from './types'

interface AppProps {
  /** Swap in other content without touching any component. */
  courses?: Course[]
}

export default function App({ courses = allCourses }: AppProps) {
  const { course, select } = useActiveCourse(courses)
  // Held above CourseView so switching language keeps you on the same tab.
  const [tab, setTab] = useState<Tab>('learn')
  const [incoming, setIncoming] = useState<SharedSet | 'invalid' | null>(null)

  const changeTab = useCallback((next: Tab) => {
    setTab(next)
    window.scrollTo(0, 0)
  }, [])

  // A friend's link carries a set in its #fragment. Take it, open the right
  // language's Cards tab, and let the import sheet ask before saving anything.
  useEffect(() => {
    let live = true
    async function receive() {
      const hash = window.location.hash
      if (!/[#&]set=/.test(hash)) return
      // Clear it first so a reload doesn't offer the same set again.
      history.replaceState(null, '', window.location.pathname + window.location.search)
      const code = extractCode(hash)
      const shared = code ? await decodeSet(code) : null
      if (!live) return
      if (shared && courses.some((c) => c.id === shared.courseId)) select(shared.courseId)
      setTab('cards')
      setIncoming(shared ?? 'invalid')
    }
    receive()
    window.addEventListener('hashchange', receive)
    return () => {
      live = false
      window.removeEventListener('hashchange', receive)
    }
  }, [courses, select])

  if (!course) return null

  // Keyed on the course so switching language remounts progress and sets
  // rather than reconciling one course's state onto another's.
  return (
    <CourseView
      key={course.id}
      course={course}
      courses={courses}
      onSelectCourse={select}
      tab={tab}
      onTab={changeTab}
      incoming={incoming}
      onIncomingHandled={() => setIncoming(null)}
    />
  )
}
