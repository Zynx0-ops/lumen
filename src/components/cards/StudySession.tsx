import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { Button } from '../ui/Button'
import { CheckIcon, CloseIcon, SwapIcon } from '../ui/Icons'
import { ProgressBar } from '../ui/ProgressBar'
import { accentVars } from '../../lib/accent'
import { shuffle } from '../../lib/shuffle'
import type { Card, Deck } from '../../lib/vocab'

interface StudySessionProps {
  deck: Deck
  /** The language on the card fronts, for the face labels. */
  language: string
  onExit: () => void
}

type Phase = 'study' | 'round-end' | 'done'

/** How far a flipped card must be dragged to count as a verdict. */
const SWIPE = 90

/**
 * Flip a card, then say whether you knew it — by button, arrow key, or by
 * swiping. Cards you're still learning come back in another round until the
 * deck is clear, the same rule lessons use for missed exercises.
 */
export function StudySession({ deck, language, onExit }: StudySessionProps) {
  const [round, setRound] = useState(() => ({ cards: shuffle(deck.cards), number: 1 }))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reversed, setReversed] = useState(false)
  const [learning, setLearning] = useState<Card[]>([])
  const [phase, setPhase] = useState<Phase>(deck.cards.length ? 'study' : 'done')

  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ startX: number; moved: boolean } | null>(null)

  const card = round.cards[index]

  const mark = useCallback(
    (knewIt: boolean) => {
      if (!flipped || phase !== 'study' || !card) return
      const stillLearning = knewIt ? learning : [...learning, card]
      setLearning(stillLearning)
      setFlipped(false)
      setDragX(0)
      if (index < round.cards.length - 1) setIndex(index + 1)
      else setPhase(stillLearning.length ? 'round-end' : 'done')
    },
    [card, flipped, index, learning, phase, round.cards.length],
  )

  const nextRound = useCallback(() => {
    setRound((r) => ({ cards: shuffle(learning), number: r.number + 1 }))
    setLearning([])
    setIndex(0)
    setFlipped(false)
    setPhase('study')
  }, [learning])

  const restart = useCallback(() => {
    setRound({ cards: shuffle(deck.cards), number: 1 })
    setLearning([])
    setIndex(0)
    setFlipped(false)
    setPhase('study')
  }, [deck.cards])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.repeat) return
      if (phase === 'study') {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          setFlipped((v) => !v)
        } else if (event.key === 'ArrowRight') mark(true)
        else if (event.key === 'ArrowLeft') mark(false)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (phase === 'round-end') nextRound()
        else onExit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mark, nextRound, onExit, phase])

  // Swiping only means something once the answer is showing.
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    drag.current = { startX: event.clientX, moved: false }
    if (flipped) {
      // Capture keeps the drag alive if the finger leaves the card. It can
      // throw for a pointer that has already gone; the drag still works then.
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        /* no capture, no problem */
      }
      setDragging(true)
    }
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !flipped) return
    const dx = event.clientX - drag.current.startX
    if (Math.abs(dx) > 6) drag.current.moved = true
    setDragX(dx)
  }
  function onPointerUp() {
    const state = drag.current
    drag.current = null
    setDragging(false)
    if (!state) return
    if (!state.moved) {
      setFlipped((v) => !v)
      return
    }
    if (dragX > SWIPE) mark(true)
    else if (dragX < -SWIPE) mark(false)
    else setDragX(0)
  }

  const front = reversed ? card?.back : card?.front
  const back = reversed ? card?.front : card?.back
  const frontLabel = reversed ? 'English' : language
  const backLabel = reversed ? language : 'English'
  const lean = Math.max(-1, Math.min(1, dragX / SWIPE))

  return (
    <div className="flex min-h-dvh flex-col bg-canvas" style={accentVars(deck.accent)}>
      <header className="sticky top-0 z-20 flex items-center gap-4 bg-canvas/80 px-4 py-4 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={onExit}
          aria-label="Stop studying"
          className="-ml-1.5 rounded-full p-1.5 text-faint transition-colors hover:text-ink"
        >
          <CloseIcon className="size-5" />
        </button>
        <ProgressBar
          ratio={phase === 'study' ? index / round.cards.length : 1}
          label={`Card ${index + 1} of ${round.cards.length}`}
        />
        <button
          type="button"
          onClick={() => setReversed((v) => !v)}
          aria-pressed={reversed}
          title="Show English first"
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
            reversed ? 'bg-[var(--accent)]/15 text-[var(--accent)]' : 'text-faint hover:text-muted'
          }`}
        >
          <SwapIcon className="size-4" />
          <span className="hidden sm:inline">English first</span>
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-10 sm:px-6">
        {phase === 'study' && card && (
          <>
            <div className="flex w-full max-w-md flex-col items-center gap-2 text-center">
              <p className="text-[13px] font-medium text-faint">
                {deck.title}
                {round.number > 1 && ` · round ${round.number}`}
              </p>
              <p className="text-[13px] tabular-nums text-faint">
                {index + 1} of {round.cards.length}
              </p>
            </div>

            <div
              className="w-full max-w-md touch-pan-y select-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                drag.current = null
                setDragging(false)
                setDragX(0)
              }}
              style={{
                transform: `translateX(${dragX}px) rotate(${dragX / 22}deg)`,
                transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* Keyed per card so a new card never animates in from its back face. */}
              <div key={`${round.number}-${index}`} className="flip-scene animate-rise">
                <div
                  className="flip-card relative aspect-[4/3] w-full cursor-pointer"
                  data-flipped={flipped}
                  role="button"
                  tabIndex={0}
                  aria-label={flipped ? `${backLabel}: ${back} — tap to flip back` : `${frontLabel}: ${front} — tap to reveal`}
                >
                  <Face label={frontLabel} text={front ?? ''} hint="Tap to reveal" />
                  <Face label={backLabel} text={back ?? ''} back lean={lean} />
                </div>
              </div>
            </div>

            <div className="flex h-14 w-full max-w-md items-center gap-3">
              {flipped ? (
                <>
                  <Button variant="neutral" block onClick={() => mark(false)}>
                    Still learning
                  </Button>
                  <Button variant="accent" block onClick={() => mark(true)}>
                    Know it
                  </Button>
                </>
              ) : (
                <Button variant="neutral" block onClick={() => setFlipped(true)}>
                  Show answer
                </Button>
              )}
            </div>
            <p className="hidden text-[12px] text-faint sm:block">
              Space to flip · ← still learning · → know it
            </p>
          </>
        )}

        {phase === 'round-end' && (
          <div className="flex w-full max-w-sm animate-rise flex-col items-center gap-6 text-center">
            <p className="text-[12px] font-semibold tracking-widest text-[var(--accent)] uppercase">
              Round {round.number} done
            </p>
            <h2 className="text-[30px] leading-tight font-semibold text-ink">
              {learning.length} still to learn
            </h2>
            <p className="text-[15px] text-muted">
              You knew {round.cards.length - learning.length} of{' '}
              {round.cards.length}. Go again with just the ones that didn’t
              stick.
            </p>
            <div className="flex w-full flex-col gap-2">
              <Button variant="accent" block onClick={nextRound}>
                Review those {learning.length}
              </Button>
              <Button variant="ghost" block onClick={onExit}>
                Finish for now
              </Button>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="flex w-full max-w-sm animate-rise flex-col items-center gap-6 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-[var(--accent)] text-black">
              <CheckIcon className="size-9" />
            </span>
            <h2 className="text-[30px] leading-tight font-semibold text-ink">
              {deck.cards.length ? 'Deck complete' : 'Nothing to study yet'}
            </h2>
            <p className="text-[15px] text-muted">
              {deck.cards.length === 0
                ? 'This deck has no cards.'
                : round.number === 1
                  ? `You knew all ${deck.cards.length} on the first pass.`
                  : `All ${deck.cards.length} known, in ${round.number} rounds.`}
            </p>
            <div className="flex w-full flex-col gap-2">
              {deck.cards.length > 0 && (
                <Button variant="accent" block onClick={restart}>
                  Study again
                </Button>
              )}
              <Button variant="ghost" block onClick={onExit}>
                Done
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function Face({
  label,
  text,
  hint,
  back = false,
  lean = 0,
}: {
  label: string
  text: string
  hint?: string
  back?: boolean
  /** -1…1 while dragging: tints the answer face toward its verdict. */
  lean?: number
}) {
  const size =
    text.length > 34 ? 'text-[22px]' : text.length > 18 ? 'text-[27px]' : 'text-[34px]'

  return (
    <div
      className={`flip-face absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[28px] border p-8 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] sheen ${
        back ? 'flip-back border-[var(--accent)]/30 bg-raised' : 'border-hairline-strong bg-elevated'
      }`}
    >
      <span className="text-[11px] font-semibold tracking-widest text-faint uppercase">
        {label}
      </span>
      <p className={`leading-snug font-semibold text-ink ${size}`}>{text}</p>
      {hint && <span className="absolute bottom-5 text-[12px] text-faint">{hint}</span>}
      {back && lean !== 0 && (
        <span
          className={`absolute top-5 rounded-full px-3 py-1 text-[12px] font-bold tracking-wide uppercase ${
            lean > 0 ? 'right-5 bg-correct/20 text-correct' : 'left-5 bg-[#ff9f0a]/20 text-[#ff9f0a]'
          }`}
          style={{ opacity: Math.abs(lean) }}
        >
          {lean > 0 ? 'Know it' : 'Still learning'}
        </span>
      )}
    </div>
  )
}
