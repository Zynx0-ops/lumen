import { useEffect } from 'react'
import { CheckIcon } from '../ui/Icons'
import type { ExerciseProps } from './types'
import type { MultipleChoiceExercise } from '../../types'

/** Short options sit two-up on wider screens; sentences stay in one column. */
function isCompact(options: string[]): boolean {
  return options.every((o) => o.length <= 18)
}

export function MultipleChoice({
  exercise,
  draft,
  onDraft,
  locked,
  verdict,
}: ExerciseProps<MultipleChoiceExercise>) {
  const selected = draft?.kind === 'choice' ? draft.index : null

  // 1–4 select an option, matching the on-tile numerals.
  useEffect(() => {
    if (locked) return
    function onKey(event: KeyboardEvent) {
      const n = Number(event.key)
      if (Number.isInteger(n) && n >= 1 && n <= exercise.options.length) {
        onDraft({ kind: 'choice', index: n - 1 })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [exercise.options.length, locked, onDraft])

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium tracking-wide text-faint uppercase">
          {exercise.prompt}
        </p>
        <p className="text-[30px] leading-tight font-semibold text-ink sm:text-[38px]">
          {exercise.question}
        </p>
      </div>

      <div
        className={`grid gap-2.5 ${
          isCompact(exercise.options) ? 'sm:grid-cols-2' : 'grid-cols-1'
        }`}
        role="radiogroup"
        aria-label={exercise.prompt}
      >
        {exercise.options.map((option, index) => {
          const isSelected = selected === index
          const isAnswer = index === exercise.answer

          // Before grading only the selection reads; after grading the correct
          // option always shows, plus a red mark on a wrong pick.
          const revealCorrect = locked && isAnswer
          const revealWrong = locked && isSelected && !isAnswer

          let tone = 'border-hairline bg-elevated text-ink hover:border-hairline-strong hover:bg-raised'
          if (revealCorrect) {
            tone = 'border-correct/60 bg-correct/12 text-ink'
          } else if (revealWrong) {
            tone = 'border-wrong/60 bg-wrong/12 text-ink'
          } else if (isSelected) {
            tone = 'border-[var(--accent)] bg-[var(--accent)]/10 text-ink'
          } else if (locked) {
            tone = 'border-hairline bg-elevated text-faint'
          }

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={locked}
              onClick={() => onDraft({ kind: 'choice', index })}
              className={`group flex items-center gap-3.5 rounded-[18px] border px-4 py-4 text-left transition-all duration-200 ease-out active:scale-[0.985] disabled:active:scale-100 ${tone}`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg border text-[12px] font-semibold transition-colors ${
                  revealCorrect
                    ? 'border-transparent bg-correct text-black'
                    : revealWrong
                      ? 'border-transparent bg-wrong text-white'
                      : isSelected
                        ? 'border-transparent bg-[var(--accent)] text-black'
                        : 'border-hairline text-faint'
                }`}
              >
                {revealCorrect ? (
                  <CheckIcon className="size-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="text-[16px] font-medium">{option}</span>
            </button>
          )
        })}
      </div>

      {verdict && !verdict.correct && exercise.note && (
        <p className="text-[14px] leading-relaxed text-muted">{exercise.note}</p>
      )}
    </div>
  )
}
