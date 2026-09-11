import { grade, isAnswerable, type Draft, type Verdict } from './grade'
import type { Exercise, LessonPart, Module } from '../types'

/**
 * The lesson engine: which exercise is showing, what happens on a miss, and
 * when a part or the whole module is finished. Kept pure so the rules can be
 * exercised without rendering anything.
 *
 * The one rule that shapes everything else: a missed exercise is appended to
 * the end of its part and keeps coming back until it is answered correctly. A
 * part therefore only ends with every one of its exercises cleared.
 */

/** One showing of an exercise. Each miss queues another showing. */
export interface Attempt {
  exercise: Exercise
  /** 0 on the first showing; each retry adds one. */
  round: number
  /** Unique per showing, so the exercise remounts with fresh state. */
  key: string
}

export type LessonPhase = 'exercise' | 'break' | 'done'

export interface LessonState {
  module: Module
  phase: LessonPhase
  partIndex: number
  /** The current part's queue; misses are appended as they happen. */
  queue: Attempt[]
  position: number
  draft: Draft | null
  verdict: Verdict | null
  /** Exercises answered correctly so far, across every part. */
  cleared: number
  /** Distinct exercises in the module. `cleared` reaches this exactly at the end. */
  total: number
  streak: number
  bestStreak: number
  /** Exercises that were answered correctly on their first showing. */
  firstTry: number
  /** Ids of exercises missed at least once. */
  missed: ReadonlySet<string>
}

export type LessonAction =
  | { type: 'draft'; draft: Draft }
  /** Matching grades itself, so it hands its answer over with the submit. */
  | { type: 'submit'; draft?: Draft }
  | { type: 'continue' }
  | { type: 'start-part' }

function attemptsFor(part: LessonPart): Attempt[] {
  return part.exercises.map((exercise) => ({
    exercise,
    round: 0,
    key: `${exercise.id}#0`,
  }))
}

export function startLesson(module: Module): LessonState {
  return {
    module,
    phase: 'exercise',
    partIndex: 0,
    queue: attemptsFor(module.parts[0]),
    position: 0,
    draft: null,
    verdict: null,
    cleared: 0,
    total: module.parts.reduce((n, part) => n + part.exercises.length, 0),
    streak: 0,
    bestStreak: 0,
    firstTry: 0,
    missed: new Set(),
  }
}

export function currentAttempt(state: LessonState): Attempt | null {
  return state.phase === 'exercise' ? (state.queue[state.position] ?? null) : null
}

export function currentPart(state: LessonState): LessonPart {
  return state.module.parts[state.partIndex]
}

/** True when pressing Continue will finish the module. */
export function isFinalStep(state: LessonState): boolean {
  return (
    state.phase === 'exercise' &&
    state.verdict !== null &&
    state.position === state.queue.length - 1 &&
    state.partIndex === state.module.parts.length - 1
  )
}

/** Where each later part begins, as a fraction of the lesson — for the bar. */
export function partBoundaries(module: Module): number[] {
  const total = module.parts.reduce((n, part) => n + part.exercises.length, 0)
  const marks: number[] = []
  let running = 0
  for (const part of module.parts.slice(0, -1)) {
    running += part.exercises.length
    marks.push(running / total)
  }
  return marks
}

export function lessonReducer(
  state: LessonState,
  action: LessonAction,
): LessonState {
  switch (action.type) {
    case 'draft':
      return state.verdict || state.phase !== 'exercise'
        ? state
        : { ...state, draft: action.draft }

    case 'submit': {
      const attempt = currentAttempt(state)
      const answer = action.draft ?? state.draft
      if (!attempt || state.verdict || !isAnswerable(answer)) return state

      const verdict = grade(attempt.exercise, answer!)
      if (verdict.correct) {
        const streak = state.streak + 1
        return {
          ...state,
          draft: answer,
          verdict,
          cleared: state.cleared + 1,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          firstTry: state.firstTry + (attempt.round === 0 ? 1 : 0),
        }
      }

      const round = attempt.round + 1
      return {
        ...state,
        draft: answer,
        verdict,
        streak: 0,
        missed: new Set(state.missed).add(attempt.exercise.id),
        queue: [
          ...state.queue,
          { exercise: attempt.exercise, round, key: `${attempt.exercise.id}#${round}` },
        ],
      }
    }

    case 'continue': {
      if (!state.verdict) return state
      const cleared = { draft: null, verdict: null }
      if (state.position < state.queue.length - 1) {
        return { ...state, ...cleared, position: state.position + 1 }
      }
      const isLastPart = state.partIndex === state.module.parts.length - 1
      return { ...state, ...cleared, phase: isLastPart ? 'done' : 'break' }
    }

    case 'start-part': {
      if (state.phase !== 'break') return state
      const partIndex = state.partIndex + 1
      return {
        ...state,
        phase: 'exercise',
        partIndex,
        queue: attemptsFor(state.module.parts[partIndex]),
        position: 0,
      }
    }
  }
}

/** Streak lengths at which the bar catches fire, then burns hotter. */
export const HEAT_STEPS = [3, 5, 8] as const
export type Heat = 0 | 1 | 2 | 3

export function heatOf(streak: number): Heat {
  let heat = 0
  for (const step of HEAT_STEPS) if (streak >= step) heat++
  return heat as Heat
}

/** Worth calling out in the feedback bar: each step up, then every fifth. */
export function isStreakMilestone(streak: number): boolean {
  return (
    (HEAT_STEPS as readonly number[]).includes(streak) ||
    (streak >= 10 && streak % 5 === 0)
  )
}
