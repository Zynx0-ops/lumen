import { useEffect, useRef, useState } from 'react'
import { CheckIcon } from '../ui/Icons'
import { seededShuffle } from '../../lib/shuffle'
import type { ExerciseProps } from './types'
import type { MatchingExercise } from '../../types'

/** Pairs are addressed by their index, so a tile only carries a number. */
type Side = 'left' | 'right'

export function Matching({
  exercise,
  locked,
  onDraft,
  onAutoSubmit,
}: ExerciseProps<MatchingExercise>) {
  // Seeded on the exercise id: stable across re-renders, varied across exercises.
  const [rightOrder] = useState(() =>
    seededShuffle(
      exercise.pairs.map((_, i) => i),
      exercise.id,
    ),
  )

  const [matched, setMatched] = useState<ReadonlySet<number>>(new Set())
  const [picked, setPicked] = useState<Partial<Record<Side, number>>>({})
  const [missed, setMissed] = useState<Partial<Record<Side, number>>>({})

  // Not rendered, so a ref keeps it out of the render cycle and free of stale
  // reads inside the delayed callbacks below.
  const mistakes = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  function later(run: () => void, ms: number) {
    timers.current.push(window.setTimeout(run, ms))
  }

  function choose(side: Side, index: number) {
    // Ignore taps while a wrong pair is still flashing.
    if (locked || matched.has(index) || missed.left !== undefined) return

    const other: Side = side === 'left' ? 'right' : 'left'
    const partner = picked[other]

    // Nothing chosen on the far side yet — or re-picking on this side.
    if (partner === undefined) {
      setPicked({ ...picked, [side]: index })
      return
    }

    setPicked({})

    if (partner === index) {
      const next = new Set(matched).add(index)
      setMatched(next)

      // Matching has no Check button: clearing the grid ends the exercise. The
      // pause lets the last tick land before the feedback bar takes over.
      if (next.size === exercise.pairs.length) {
        const draft = { kind: 'match', mistakes: mistakes.current } as const
        onDraft(draft)
        later(() => onAutoSubmit(draft), 460)
      }
      return
    }

    mistakes.current += 1
    setMissed({ [side]: index, [other]: partner })
    later(() => setMissed({}), 620)
  }

  function tile(side: Side, index: number, label: string) {
    const isMatched = matched.has(index)
    const isPicked = picked[side] === index
    const isMissed = missed[side] === index

    let tone =
      'border-hairline bg-elevated text-ink hover:border-hairline-strong hover:bg-raised'
    if (isMatched) {
      tone = 'border-[var(--accent)]/35 bg-[var(--accent)]/10 text-[var(--accent)]'
    } else if (isMissed) {
      tone = 'border-wrong bg-wrong/12 text-ink animate-shake'
    } else if (isPicked) {
      tone = 'border-[var(--accent)] bg-[var(--accent)]/10 text-ink'
    }

    return (
      <button
        key={`${side}-${index}`}
        type="button"
        disabled={locked || isMatched}
        aria-pressed={isPicked}
        onClick={() => choose(side, index)}
        className={`flex min-h-14 items-center justify-between gap-2 rounded-2xl border px-3.5 py-3 text-left text-[15px] font-medium transition-all duration-200 ease-out active:scale-[0.97] disabled:active:scale-100 ${tone}`}
      >
        <span className="min-w-0 break-words">{label}</span>
        {isMatched && <CheckIcon className="size-4 shrink-0 animate-pop" />}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium tracking-wide text-faint uppercase">
          {exercise.prompt}
        </p>
        <p className="text-[15px] text-muted">
          Tap a word, then its translation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {exercise.pairs.map((pair, index) => tile('left', index, pair.left))}
        </div>
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {rightOrder.map((index) =>
            tile('right', index, exercise.pairs[index].right),
          )}
        </div>
      </div>
    </div>
  )
}
