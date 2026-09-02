import { useCallback, useEffect, useState } from 'react'
import { ExerciseView } from './exercises/ExerciseView'
import { Button } from './ui/Button'
import { ProgressBar } from './ui/ProgressBar'
import { CheckIcon, CloseIcon } from './ui/Icons'
import { accentVars } from '../lib/accent'
import { grade, isAnswerable, type Draft, type Verdict } from '../lib/grade'
import type { Exercise, Module, Section } from '../types'

interface LessonPlayerProps {
  section: Section
  module: Module
  /** Leave without finishing; nothing is recorded. */
  onExit: () => void
  /** Called once the last exercise is answered. */
  onComplete: (moduleId: string) => void
}

const PRAISE = ['Correct', 'Nice', 'Exactly', "That's it"]

function feedbackFor(exercise: Exercise, verdict: Verdict, step: number) {
  if (verdict.correct) {
    return { title: PRAISE[step % PRAISE.length], answer: null }
  }
  if (exercise.type === 'matching') {
    return { title: 'Matched, with a few slips', answer: null }
  }
  return { title: 'Not quite', answer: verdict.expected }
}

export function LessonPlayer({
  section,
  module,
  onExit,
  onComplete,
}: LessonPlayerProps) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const exercise = module.exercises[step]
  const total = module.exercises.length
  const isLast = step === total - 1

  const submit = useCallback(
    (answer: Draft | null) => {
      if (!answer || verdict) return
      const result = grade(exercise, answer)
      setVerdict(result)
      if (result.correct) setScore((n) => n + 1)
    },
    [exercise, verdict],
  )

  const advance = useCallback(() => {
    if (isLast) {
      setDone(true)
      onComplete(module.id)
      return
    }
    setStep((n) => n + 1)
    setDraft(null)
    setVerdict(null)
  }, [isLast, module.id, onComplete])

  // Enter drives the whole lesson: check, then continue.
  useEffect(() => {
    if (done) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Enter') return
      event.preventDefault()
      if (verdict) advance()
      else if (isAnswerable(draft)) submit(draft)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance, done, draft, submit, verdict])

  const onDraft = useCallback((next: Draft) => setDraft(next), [])

  if (done) {
    return (
      <LessonSummary
        section={section}
        module={module}
        score={score}
        total={total}
        onExit={onExit}
      />
    )
  }

  const feedback = verdict ? feedbackFor(exercise, verdict, step) : null
  const showCheck = exercise.type !== 'matching'

  return (
    <div
      className="flex min-h-dvh flex-col bg-canvas"
      style={accentVars(section.accent)}
    >
      <header className="sticky top-0 z-20 flex items-center gap-4 bg-canvas/80 px-4 py-4 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={onExit}
          aria-label="Leave lesson"
          className="-ml-1.5 rounded-full p-1.5 text-faint transition-colors hover:text-ink"
        >
          <CloseIcon className="size-5" />
        </button>
        <ProgressBar
          ratio={(step + (verdict ? 1 : 0)) / total}
          label={`Exercise ${step + 1} of ${total}`}
        />
        <span className="w-11 shrink-0 text-right text-[13px] font-medium tabular-nums text-faint">
          {step + 1}/{total}
        </span>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pt-8 pb-40 sm:px-6 sm:pt-16">
        <div key={exercise.id} className="w-full max-w-xl animate-rise">
          <ExerciseView
            exercise={exercise}
            draft={draft}
            onDraft={onDraft}
            locked={verdict !== null}
            verdict={verdict}
            onAutoSubmit={submit}
          />
        </div>
      </main>

      <footer
        className={`sticky bottom-0 z-20 border-t transition-colors duration-300 ${
          verdict
            ? verdict.correct
              ? 'border-correct/25 bg-correct/10'
              : 'border-wrong/25 bg-wrong/10'
            : 'border-hairline bg-canvas/85'
        } backdrop-blur-xl`}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {feedback && (
            <div className="flex animate-slide-up items-start gap-3">
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
                  verdict?.correct ? 'bg-correct text-black' : 'bg-wrong text-white'
                }`}
              >
                {verdict?.correct ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <CloseIcon className="size-3.5" />
                )}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p
                  className={`text-[15px] font-semibold ${
                    verdict?.correct ? 'text-correct' : 'text-wrong'
                  }`}
                >
                  {feedback.title}
                </p>
                {feedback.answer && (
                  <p className="text-[14px] text-ink">
                    <span className="text-muted">Answer: </span>
                    {feedback.answer}
                  </p>
                )}
              </div>
            </div>
          )}

          {verdict ? (
            <Button
              variant={verdict.correct ? 'correct' : 'wrong'}
              block
              onClick={advance}
            >
              {isLast ? 'Finish' : 'Continue'}
            </Button>
          ) : showCheck ? (
            <Button
              variant="accent"
              block
              disabled={!isAnswerable(draft)}
              onClick={() => submit(draft)}
            >
              Check
            </Button>
          ) : (
            <p className="py-3.5 text-center text-[14px] text-faint">
              Match every pair to continue
            </p>
          )}
        </div>
      </footer>
    </div>
  )
}

interface LessonSummaryProps {
  section: Section
  module: Module
  score: number
  total: number
  onExit: () => void
}

function LessonSummary({
  section,
  module,
  score,
  total,
  onExit,
}: LessonSummaryProps) {
  const perfect = score === total

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-16"
      style={accentVars(section.accent)}
    >
      <div className="flex w-full max-w-sm animate-rise flex-col items-center gap-9 text-center">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 animate-halo rounded-full bg-[var(--accent)]/25" />
          <span className="relative flex size-24 items-center justify-center rounded-full bg-[var(--accent)] text-black">
            <CheckIcon className="size-11" />
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-[30px] font-semibold text-ink">Module complete</h2>
          <p className="text-[16px] text-muted">
            {module.title} · {section.title}
          </p>
        </div>

        <div className="w-full rounded-card border border-hairline bg-elevated p-5 sheen">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] text-muted">Correct answers</span>
            <span className="text-[22px] font-semibold tabular-nums text-ink">
              {score}
              <span className="text-muted"> / {total}</span>
            </span>
          </div>
          <ProgressBar
            ratio={score / total}
            className="mt-4"
            label="Correct answers"
          />
          <p className="mt-3.5 text-left text-[13px] text-faint">
            {perfect
              ? 'A clean run — nothing to review.'
              : 'The next module builds on this one; you can retake it any time.'}
          </p>
        </div>

        <Button variant="accent" block onClick={onExit}>
          Back to path
        </Button>
      </div>
    </div>
  )
}
