import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { HomeScreen } from './HomeScreen'
import { ImportSheet } from './cards/ImportSheet'
import { SetEditor } from './cards/SetEditor'
import { ShareSheet } from './cards/ShareSheet'
import { StudySession } from './cards/StudySession'
import { LessonPlayer } from './lesson/LessonPlayer'
import type { Tab } from './shell/Tabs'
import { useCardSets } from '../hooks/useCardSets'
import { useProgress } from '../hooks/useProgress'
import { newSetId } from '../lib/sets'
import type { SharedSet } from '../lib/share'
import type { Deck } from '../lib/vocab'
import type { Course, Module, Section } from '../types'

/** The home tabs, plus the full-screen views that replace them. */
type View =
  | { name: 'home' }
  | { name: 'lesson'; section: Section; module: Module }
  | { name: 'study'; deck: Deck }
  | { name: 'edit-set'; setId: string | null }

interface CourseViewProps {
  course: Course
  courses: Course[]
  onSelectCourse: (courseId: string) => void
  tab: Tab
  onTab: (tab: Tab) => void
  /** A set that arrived through a share link. */
  incoming: SharedSet | 'invalid' | null
  onIncomingHandled: () => void
}

/** Owns one course's progress and flashcard sets, and routes between views. */
export function CourseView({
  course,
  courses,
  onSelectCourse,
  tab,
  onTab,
  incoming,
  onIncomingHandled,
}: CourseViewProps) {
  const { completed, completeModule, reset } = useProgress(course.id)
  const { sets, saveSet, deleteSet } = useCardSets()
  const [view, setView] = useState<View>({ name: 'home' })
  const [sharingId, setSharingId] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const homeScroll = useRef(0)

  useEffect(() => {
    document.title = `Lumen — ${course.language}`
  }, [course.language])

  // Full-screen views open at the top; home returns to where you left it.
  useLayoutEffect(() => {
    window.scrollTo(0, view.name === 'home' ? homeScroll.current : 0)
  }, [view])

  const go = useCallback(
    (next: View) => {
      if (view.name === 'home') homeScroll.current = window.scrollY
      setView(next)
    },
    [view.name],
  )
  const goHome = useCallback(() => setView({ name: 'home' }), [])

  const courseSets = sets.filter((s) => s.courseId === course.id)
  const sharing = sets.find((s) => s.id === sharingId)

  function closeImport() {
    setImporting(false)
    onIncomingHandled()
  }

  function importShared(shared: SharedSet) {
    saveSet({
      id: newSetId(),
      courseId: shared.courseId,
      name: shared.name,
      cards: shared.cards,
      updatedAt: Date.now(),
    })
    closeImport()
    // Sets live with their language; go there so the new one is in view.
    if (shared.courseId !== course.id) onSelectCourse(shared.courseId)
  }

  if (view.name === 'lesson') {
    return (
      <LessonPlayer
        key={view.module.id}
        section={view.section}
        module={view.module}
        onComplete={completeModule}
        onExit={goHome}
      />
    )
  }

  if (view.name === 'study') {
    return (
      <StudySession
        key={view.deck.id}
        deck={view.deck}
        language={course.language}
        onExit={goHome}
      />
    )
  }

  if (view.name === 'edit-set') {
    const set = view.setId ? (sets.find((s) => s.id === view.setId) ?? null) : null
    return (
      <SetEditor
        course={course}
        set={set}
        onSave={(saved) => {
          saveSet(saved)
          goHome()
        }}
        onDelete={(id) => {
          deleteSet(id)
          goHome()
        }}
        onClose={goHome}
      />
    )
  }

  return (
    <>
      <HomeScreen
        course={course}
        courses={courses}
        completed={completed}
        sets={courseSets}
        tab={tab}
        onTab={onTab}
        onSelectCourse={onSelectCourse}
        onOpenModule={(section, module) => go({ name: 'lesson', section, module })}
        onReset={reset}
        onStudy={(deck) => go({ name: 'study', deck })}
        onNewSet={() => go({ name: 'edit-set', setId: null })}
        onEditSet={(setId) => go({ name: 'edit-set', setId })}
        onShareSet={setSharingId}
        onImport={() => setImporting(true)}
      />

      {(importing || incoming) && (
        <ImportSheet
          courses={courses}
          sets={sets}
          incoming={incoming}
          onImport={importShared}
          onClose={closeImport}
        />
      )}

      {sharing && (
        <ShareSheet
          set={sharing}
          language={course.language}
          onClose={() => setSharingId(null)}
        />
      )}
    </>
  )
}
