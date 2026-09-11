import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { LessonSummary } from './LessonSummary'
import { PartBreak } from './PartBreak'
import { StreakBar } from './StreakBar'
import { ExerciseView } from '../exercises/ExerciseView'
import { Button } from '../ui/Button'
import { CheckIcon, CloseIcon, FlameIcon, UndoIcon } from '../ui/Icons'
import { accentVars } from '../../lib/accent'
import { isAnswerable, type Draft } from '../../lib/grade'
import {
  currentAttempt,
  currentPart,
  heatOf,
  isFinalStep,
  isStreakMilestone,
  lessonReducer,
  partBoundaries,
  startLesson,
  type LessonState,
} from '../../lib/lesson'
import { wordsFrom } from '../../lib/vocab'
import type { Module, Section } from '../../types'

interface LessonPlayerProps {
  section: Section
  module: Module
  /** Leave without finishing; nothing is recorded. */
  onExit: () => void
  /** Called once, as the learner continues past the final exercise. */
  onComplete: (moduleId: string) => void
}

const PRAISE = ['Correct', 'Nice', 'Exactly', "That's it"]

function feedbackFor(state: LessonState) {
  const attempt = currentAttempt(state)
  const verdict = state.verdict
  if (!attempt || !verdict) return null

  if (verdict.correct) {
    if (isStreakMilestone(state.streak)) {
      return { title: `${state.streak} in a row`, detail: null, fire: true }
    }
    return {
      title: attempt.round > 0 ? 'Got it this time' : PRAISE[state.cleared % PRAISE.length],
      detail: null,
      fire: false,
    }
  }

  // Every miss is queued again, so say so — the learner knows it isn't lost.
  const retry = 'You’ll see this one again before the part ends.'
  if (attempt.exercise.type === 'matching') {
    return { title: 'Matched, with a few slips', detail: retry, fire: false }
  }
  return {
    title: 'Not quite',
    answer: verdict.expected,
    detail: retry,
    fire: false,
  }
}

export function LessonPlayer({
  section,
  module,
  onExit,
  onComplete,
}: LessonPlayerProps) {
  const [state, dispatch] = useReducer(lessonReducer, module, startLesson)
  const attempt = currentAttempt(state)
  const part = currentPart(state)
  const marks = useMemo(() => partBoundaries(module), [module])

  const onDraft = useCallback(
    (draft: Draft) => dispatch({ type: 'draft', draft }),
    [],
  )
  const onAutoSubmit = useCallback(
    (draft: Draft) => dispatch({ type: 'submit', draft }),
    [],
  )

  const advance = useCallback(() => {
    // Recorded on the way out of the last exercise, from the event itself.
    if (isFinalStep(state)) onComplete(module.id)
    dispatch({ type: 'continue' })
  }, [module.id, onComplete, state])

  // Enter drives the whole lesson: check, continue, start the next part.
  useEffect(() => {
    if (state.phase === 'done') return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Enter' || event.repeat) return
      event.preventDefault()
      if (state.phase === 'break') dispatch({ type: 'start-part' })
      else if (state.verdict) advance()
      else if (isAnswerable(state.draft)) dispatch({ type: 'submit' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance, state.draft, state.phase, state.verdict])

  if (state.phase === 'done') {
    return (
      <LessonSummary
        section={section}
        module={module}
        total={state.total}
        firstTry={state.firstTry}
        fixed={state.missed.size}
        bestStreak={state.bestStreak}
        onExit={onExit}
      />
    )
  }

  const feedback = feedbackFor(state)
  const heat = heatOf(state.streak)
  const verdict = state.verdict
  const nextPart = module.parts[state.partIndex + 1]

  return (
    <div
      className="flex min-h-dvh flex-col bg-canvas"
      style={accentVars(section.accent)}
    >
      <header className="sticky top-0 z-20 flex items-center gap-4 bg-canvas/80 px-4 pt-5 pb-4 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={onExit}
          aria-label="Leave lesson"
          className="-ml-1.5 rounded-full p-1.5 text-faint transition-colors hover:text-ink"
        >
          <CloseIcon className="size-5" />
        </button>
        <StreakBar
          ratio={state.cleared / state.total}
          streak={state.streak}
          marks={marks}
          label={`${state.cleared} of ${state.total} exercises cleared`}
        />
        <span
          className={`flex w-12 shrink-0 items-center justify-end gap-0.5 text-[13px] font-semibold tabular-nums transition-colors ${
            heat > 0 ? 'text-[#ff9f0a]' : 'text-faint'
          }`}
        >
          {heat > 0 ? (
            <>
              <FlameIcon className="size-4" />
              {state.streak}
            </>
          ) : (
            `${state.cleared}/${state.total}`
          )}
        </span>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-44 sm:px-6 sm:pt-12">
        {state.phase === 'break' && nextPart ? (
          <PartBreak
            finished={part}
            next={nextPart}
            number={state.partIndex + 1}
            count={module.parts.length}
            words={wordsFrom(part.exercises)}
            retried={part.exercises.filter((e) => state.missed.has(e.id)).length}
          />
        ) : (
          attempt && (
            <div key={attempt.key} className="w-full max-w-xl animate-rise">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold tracking-widest text-[var(--accent)] uppercase">
                  Part {state.partIndex + 1} · {part.title}
                </span>
                {attempt.round > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-[#ff9f0a]/12 px-2 py-0.5 text-[11px] font-semibold text-[#ff9f0a]">
                    <UndoIcon className="size-3" />
                    Another try
                  </span>
                )}
              </div>
              <ExerciseView
                exercise={attempt.exercise}
                draft={state.draft}
                onDraft={onDraft}
                locked={verdict !== null}
                verdict={verdict}
                onAutoSubmit={onAutoSubmit}
                seed={attempt.key}
              />
            </div>
          )
        )}
      </main>

      <footer
        className={`fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur-xl transition-colors duration-300 ${
          verdict
            ? verdict.correct
              ? 'border-correct/25 bg-[#0b1a0f]/90'
              : 'border-wrong/25 bg-[#1f0d0c]/90'
            : 'border-hairline bg-canvas/85'
        }`}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {feedback && verdict && (
            <div className="flex animate-slide-up items-start gap-3">
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
                  feedback.fire
                    ? 'bg-transparent'
                    : verdict.correct
                      ? 'bg-correct text-black'
                      : 'bg-wrong text-white'
                }`}
              >
                {feedback.fire ? (
                  <FlameIcon className="flame-flicker size-6" />
                ) : verdict.correct ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <CloseIcon className="size-3.5" />
                )}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p
                  className={`text-[15px] font-semibold ${
                    feedback.fire
                      ? 'text-[#ff9f0a]'
                      : verdict.correct
                        ? 'text-correct'
                        : 'text-wrong'
                  }`}
                >
                  {feedback.title}
                </p>
                {'answer' in feedback && feedback.answer && (
                  <p className="text-[14px] text-ink">
                    <span className="text-muted">Answer: </span>
                    {feedback.answer}
                  </p>
                )}
                {feedback.detail && (
                  <p className="text-[13px] text-muted">{feedback.detail}</p>
                )}
              </div>
            </div>
          )}

          {state.phase === 'break' && nextPart ? (
            <Button
              variant="accent"
              block
              onClick={() => dispatch({ type: 'start-part' })}
            >
              Start {nextPart.title}
            </Button>
          ) : verdict ? (
            <Button
              variant={verdict.correct ? 'correct' : 'wrong'}
              block
              onClick={advance}
            >
              {isFinalStep(state) ? 'Finish' : 'Continue'}
            </Button>
          ) : attempt?.exercise.type === 'matching' ? (
            <p className="py-3.5 text-center text-[14px] text-faint">
              Match every pair to continue
            </p>
          ) : (
            <Button
              variant="accent"
              block
              disabled={!isAnswerable(state.draft)}
              onClick={() => dispatch({ type: 'submit' })}
            >
              Check
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
