import { parseSet, type CardSet } from './sets'

/**
 * The app's entire persistence layer: which course you are on, which modules
 * you have finished in each, and your flashcard sets. Everything is per-device localStorage —
 * there is no account and nothing leaves the browser.
 *
 * Every call is guarded: private browsing, disabled storage and corrupt JSON
 * all degrade to "no saved progress" rather than breaking the app.
 */

const PROGRESS_KEY = 'lumen.progress.v1'
const ACTIVE_KEY = 'lumen.course.v1'
const SETS_KEY = 'lumen.sets.v1'

export function readCompleted(courseId: string): Set<string> {
  try {
    const raw = localStorage.getItem(`${PROGRESS_KEY}.${courseId}`)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? new Set(parsed.filter((id): id is string => typeof id === 'string'))
      : new Set()
  } catch {
    return new Set()
  }
}

export function writeCompleted(
  courseId: string,
  completed: ReadonlySet<string>,
): void {
  try {
    localStorage.setItem(
      `${PROGRESS_KEY}.${courseId}`,
      JSON.stringify([...completed]),
    )
  } catch {
    // Storage unavailable — progress still works for this session.
  }
}

export function readActiveCourse(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}

export function writeActiveCourse(courseId: string): void {
  try {
    localStorage.setItem(ACTIVE_KEY, courseId)
  } catch {
    // Non-fatal: the app just opens on the first course next time.
  }
}

/** Every saved set, across all courses. Anything malformed is dropped. */
export function readSets(): CardSet[] {
  try {
    const raw = localStorage.getItem(SETS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.map(parseSet).filter((set): set is CardSet => set !== null)
      : []
  } catch {
    return []
  }
}

export function writeSets(sets: CardSet[]): void {
  try {
    localStorage.setItem(SETS_KEY, JSON.stringify(sets))
  } catch {
    // Storage full or unavailable — the sets survive until the tab closes.
  }
}
