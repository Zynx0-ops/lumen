import { useEffect, useRef } from 'react'
import type { ExerciseProps } from './types'
import type { FillBlankExercise } from '../../types'

export function FillBlank({
  exercise,
  draft,
  onDraft,
  locked,
  verdict,
}: ExerciseProps<FillBlankExercise>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const value = draft?.kind === 'text' ? draft.value : ''
  const [before, after] = exercise.sentence.split('___')

  useEffect(() => {
    // Focus on arrival so a keyboard user can type straight away. On touch the
    // keyboard opening here is the expected behaviour for a typing exercise.
    inputRef.current?.focus()
  }, [exercise.id])

  // Size the field to the expected answer so the blank doesn't jump as you type.
  const width = `${Math.max(exercise.answer.length + 2, 7)}ch`

  const fieldTone = !locked
    ? 'border-hairline-strong text-ink focus:border-[var(--accent)]'
    : verdict?.correct
      ? 'border-correct text-correct'
      : 'border-wrong text-wrong'

  return (
    <div className="flex flex-col gap-7">
      <p className="text-[13px] font-medium tracking-wide text-faint uppercase">
        {exercise.prompt}
      </p>

      <div className="flex flex-col gap-4">
        <p className="flex flex-wrap items-end gap-x-1.5 gap-y-3 text-[26px] leading-snug font-semibold text-ink sm:text-[32px]">
          {before}
          <input
            ref={inputRef}
            type="text"
            value={value}
            disabled={locked}
            onChange={(e) => onDraft({ kind: 'text', value: e.target.value })}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Missing word"
            style={{ width }}
            className={`border-b-2 bg-transparent pb-0.5 text-center font-semibold caret-[var(--accent)] outline-none transition-colors duration-200 disabled:opacity-100 ${fieldTone}`}
          />
          {after}
        </p>

        {exercise.translation && (
          <p className="text-[15px] text-muted">{exercise.translation}</p>
        )}
      </div>

      {verdict && !verdict.correct && exercise.note && (
        <p className="text-[14px] leading-relaxed text-muted">{exercise.note}</p>
      )}
    </div>
  )
}
