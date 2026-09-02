import type { Exercise } from '../types'

/** The learner's in-progress answer, shaped per exercise type. */
export type Draft =
  | { kind: 'choice'; index: number }
  | { kind: 'text'; value: string }
  | { kind: 'match'; mistakes: number }

export interface Verdict {
  correct: boolean
  /** The answer to show the learner when they get it wrong. */
  expected: string
}

/**
 * Loosen text comparison: case, accents, surrounding punctuation and repeated
 * whitespace are all ignored, so "Adios!" passes for "adiós".
 */
export function normalise(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.,!?¡¿;:"'()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function grade(exercise: Exercise, draft: Draft): Verdict {
  switch (exercise.type) {
    case 'multiple-choice':
      return {
        correct: draft.kind === 'choice' && draft.index === exercise.answer,
        expected: exercise.options[exercise.answer],
      }

    case 'fill-blank': {
      const accepted = [exercise.answer, ...(exercise.alternates ?? [])]
      const given = draft.kind === 'text' ? normalise(draft.value) : ''
      return {
        correct: given.length > 0 && accepted.some((a) => normalise(a) === given),
        expected: exercise.answer,
      }
    }

    case 'matching':
      // Matching grades itself as the learner pairs tiles; a clean run counts.
      return {
        correct: draft.kind === 'match' && draft.mistakes === 0,
        expected: 'Every pair matched on the first try',
      }
  }
}

/** Whether a draft is complete enough for the Check button to light up. */
export function isAnswerable(draft: Draft | null): boolean {
  if (!draft) return false
  if (draft.kind === 'text') return draft.value.trim().length > 0
  return true
}
