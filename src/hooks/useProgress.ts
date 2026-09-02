import { useCallback, useEffect, useState } from 'react'
import { readCompleted, writeCompleted } from '../lib/storage'

/**
 * Completed module ids for one course, persisted so a reload doesn't reset the
 * path. Callers mount this per course — switching languages remounts rather
 * than reloading state in place.
 */
export function useProgress(courseId: string) {
  const [completed, setCompleted] = useState<Set<string>>(() =>
    readCompleted(courseId),
  )

  useEffect(() => {
    writeCompleted(courseId, completed)
  }, [completed, courseId])

  const completeModule = useCallback((moduleId: string) => {
    setCompleted((prev) => {
      if (prev.has(moduleId)) return prev
      const next = new Set(prev)
      next.add(moduleId)
      return next
    })
  }, [])

  const reset = useCallback(() => setCompleted(new Set()), [])

  return { completed, completeModule, reset }
}
