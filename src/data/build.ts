import type {
  Exercise,
  FillBlankExercise,
  LessonPart,
  MatchingExercise,
  Module,
  MultipleChoiceExercise,
} from '../types'

/**
 * Authoring helpers for course files. They only save typing: each returns plain
 * data in the shapes from `src/types.ts`, so a course loaded as JSON needs none
 * of this.
 */

type Draft<T> = Omit<T, 'id'>

/** An exercise before `defineModule` gives it an id. */
export type ExerciseDraft =
  | Draft<MultipleChoiceExercise>
  | Draft<FillBlankExercise>
  | Draft<MatchingExercise>

export interface PartDraft {
  title: string
  exercises: ExerciseDraft[]
}

/**
 * Multiple choice, with the right answer written apart from the distractors.
 * The lesson player shuffles options, so their order here carries no hint.
 */
export function choose(
  prompt: string,
  question: string,
  correct: string,
  distractors: string[],
  note?: string,
): Draft<MultipleChoiceExercise> {
  return {
    type: 'multiple-choice',
    prompt,
    question,
    options: [correct, ...distractors],
    answer: 0,
    ...(note ? { note } : {}),
  }
}

/** Fill in the blank. Mark the gap in `sentence` with `___`. */
export function fill(
  sentence: string,
  answer: string,
  translation: string,
  extra: { alternates?: string[]; note?: string; prompt?: string } = {},
): Draft<FillBlankExercise> {
  return {
    type: 'fill-blank',
    prompt: extra.prompt ?? 'Fill in the blank',
    sentence,
    answer,
    translation,
    ...(extra.alternates ? { alternates: extra.alternates } : {}),
    ...(extra.note ? { note: extra.note } : {}),
  }
}

/** Matching, written as [word, translation] pairs. */
export function match(
  pairs: [string, string][],
  note?: string,
): Draft<MatchingExercise> {
  return {
    type: 'matching',
    prompt: 'Match the pairs',
    pairs: pairs.map(([left, right]) => ({ left, right })),
    ...(note ? { note } : {}),
  }
}

export function part(title: string, exercises: ExerciseDraft[]): PartDraft {
  return { title, exercises }
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Assembles a module and derives every id from its position — part
 * `s1-m1-words`, exercise `s1-m1-words-2` — so ids can never collide.
 */
export function defineModule(
  id: string,
  title: string,
  subtitle: string,
  parts: [PartDraft, PartDraft, ...PartDraft[]],
): Module {
  const built = parts.map((draft): LessonPart => {
    const partId = `${id}-${slug(draft.title)}`
    return {
      id: partId,
      title: draft.title,
      exercises: draft.exercises.map(
        (exercise, index) =>
          ({ ...exercise, id: `${partId}-${index + 1}` }) as Exercise,
      ),
    }
  })
  return { id, title, subtitle, parts: built as Module['parts'] }
}
