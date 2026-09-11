import { CheckIcon } from '../ui/Icons'
import type { LessonPart } from '../../types'

interface PartBreakProps {
  finished: LessonPart
  next: LessonPart
  /** 1-based position of the part just finished, and how many there are. */
  number: number
  count: number
  /** Words the finished part taught, shown as a bridge into the next. */
  words: string[]
  /** Exercises in the finished part that needed more than one try. */
  retried: number
}

/** The pause between parts: what was just covered, and what comes next. */
export function PartBreak({
  finished,
  next,
  number,
  count,
  words,
  retried,
}: PartBreakProps) {
  const heading =
    next.title.toLowerCase() === 'sentences'
      ? 'Nice. Now use them in sentences.'
      : `Nice. Next up: ${next.title}.`

  return (
    <div className="flex w-full max-w-md animate-rise flex-col gap-8">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--accent)] text-black">
          <CheckIcon className="size-5" />
        </span>
        <span className="text-[12px] font-semibold tracking-widest text-[var(--accent)] uppercase">
          Part {number} of {count} · {finished.title} done
        </span>
      </div>

      <h2 className="text-[30px] leading-tight font-semibold text-ink sm:text-[34px]">
        {heading}
      </h2>

      {words.length > 0 && (
        <div className="rounded-card border border-hairline bg-elevated p-5 sheen">
          <p className="text-[12px] font-medium tracking-widest text-faint uppercase">
            Words from this part
          </p>
          <ul className="mt-3.5 flex flex-wrap gap-2">
            {words.map((word) => (
              <li
                key={word}
                className="rounded-full border border-hairline bg-raised px-3 py-1.5 text-[14px] text-ink"
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[14px] text-muted">
        {finished.exercises.length} cleared
        {retried > 0
          ? ` · ${retried} needed another try`
          : ' · every one on the first try'}
      </p>
    </div>
  )
}
