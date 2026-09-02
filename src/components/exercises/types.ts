import type { Draft, Verdict } from '../../lib/grade'
import type { Exercise } from '../../types'

/**
 * Every exercise type takes the same props, so the lesson player can hold the
 * answer state and the Check button without knowing which kind is on screen.
 */
export interface ExerciseProps<T extends Exercise = Exercise> {
  exercise: T
  /** The learner's current, ungraded answer. */
  draft: Draft | null
  onDraft: (draft: Draft) => void
  /** True once the answer is graded — inputs stop responding. */
  locked: boolean
  /** Set after grading, so an exercise can mark up the right answer. */
  verdict: Verdict | null
  /** For exercises that finish on their own, like matching. */
  onAutoSubmit: (draft: Draft) => void
}
