/**
 * Content model for the learning path.
 *
 * A Course holds Sections, a Section holds Modules, and a Module is one lesson
 * split into Parts of Exercises. Everything here is plain data — see
 * `src/data/` for the shipped courses, and swap in real content by matching
 * these shapes.
 */

export type ExerciseType = 'multiple-choice' | 'fill-blank' | 'matching'

interface ExerciseBase {
  id: string
  type: ExerciseType
  /** Instruction line shown above the exercise, e.g. "Choose the translation". */
  prompt: string
  /** Optional teaching aside revealed with the answer feedback. */
  note?: string
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: 'multiple-choice'
  /** The word or phrase being asked about. */
  question: string
  options: string[]
  /** Index into `options`. */
  answer: number
}

export interface FillBlankExercise extends ExerciseBase {
  type: 'fill-blank'
  /** Sentence containing `___` where the missing word goes. */
  sentence: string
  answer: string
  /** Other spellings accepted as correct. Matching ignores case and accents. */
  alternates?: string[]
  /** Shown under the sentence as a crutch. */
  translation?: string
}

export interface MatchingExercise extends ExerciseBase {
  type: 'matching'
  /** 3–5 pairs works best; more than that crowds the two columns. */
  pairs: { left: string; right: string }[]
}

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | MatchingExercise

/** A stretch of a lesson worked through in one go, e.g. "Words". */
export interface LessonPart {
  id: string
  title: string
  exercises: Exercise[]
}

export interface Module {
  id: string
  title: string
  /** One-line description of what the module covers. */
  subtitle: string
  /**
   * A module is a single sitting split into parts — Words, then Sentences —
   * with a short break between them. The tuple type insists on at least two.
   */
  parts: [LessonPart, LessonPart, ...LessonPart[]]
}

/** Accent keys resolve to hex values in `ACCENTS`. */
export type AccentName = 'mint' | 'azure' | 'violet' | 'amber' | 'rose'

export interface Section {
  id: string
  title: string
  subtitle: string
  accent: AccentName
  modules: Module[]
}

export interface Course {
  id: string
  /** Language being learned, e.g. "Spanish". */
  language: string
  /** Two-letter code used in the course header. */
  code: string
  sections: Section[]
}

export const ACCENTS: Record<AccentName, string> = {
  mint: '#30d5a0',
  azure: '#0a84ff',
  violet: '#bf7af0',
  amber: '#ff9f0a',
  rose: '#ff6482',
}

/** Where a module sits in the learner's progression. */
export type ModuleStatus = 'locked' | 'available' | 'completed'
