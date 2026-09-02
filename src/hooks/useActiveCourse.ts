import { useCallback, useEffect, useState } from 'react'
import { readActiveCourse, writeActiveCourse } from '../lib/storage'
import type { Course } from '../types'

/**
 * The language currently being learned, remembered between visits. Falls back
 * to the first course if nothing is stored or the stored id no longer exists —
 * so removing a course from the list can never strand a learner.
 */
export function useActiveCourse(courses: Course[]) {
  const [courseId, setCourseId] = useState(() => {
    const saved = readActiveCourse()
    return courses.some((c) => c.id === saved) ? saved! : (courses[0]?.id ?? '')
  })

  useEffect(() => {
    if (courseId) writeActiveCourse(courseId)
  }, [courseId])

  const select = useCallback((next: string) => setCourseId(next), [])
  const course = courses.find((c) => c.id === courseId) ?? courses[0]

  return { course, select }
}
