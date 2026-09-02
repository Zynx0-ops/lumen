import { useEffect, useState } from 'react'
import { Dashboard } from './Dashboard'
import { LessonPlayer } from './LessonPlayer'
import { useProgress } from '../hooks/useProgress'
import type { Course, Module, Section } from '../types'

/** Which screen is showing. A course has exactly two. */
type View = { name: 'path' } | { name: 'lesson'; section: Section; module: Module }

interface CourseViewProps {
  course: Course
  /** Every course, so the path screen can offer the language picker. */
  courses: Course[]
  onSelectCourse: (courseId: string) => void
}

/** Owns one course's progress and which of its two screens is showing. */
export function CourseView({
  course,
  courses,
  onSelectCourse,
}: CourseViewProps) {
  const { completed, completeModule, reset } = useProgress(course.id)
  const [view, setView] = useState<View>({ name: 'path' })

  // Name the tab after the language being learned.
  useEffect(() => {
    document.title = `Lumen — ${course.language}`
  }, [course.language])

  // A lesson is a full-screen takeover; keep the path from scrolling behind it.
  useEffect(() => {
    if (view.name !== 'lesson') return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [view.name])

  if (view.name === 'lesson') {
    return (
      <LessonPlayer
        key={view.module.id}
        section={view.section}
        module={view.module}
        onComplete={completeModule}
        onExit={() => setView({ name: 'path' })}
      />
    )
  }

  return (
    <Dashboard
      course={course}
      courses={courses}
      completed={completed}
      onSelectCourse={onSelectCourse}
      onOpenModule={(section, module) =>
        setView({ name: 'lesson', section, module })
      }
      onReset={reset}
    />
  )
}
