import { FlameIcon } from '../ui/Icons'
import { heatOf, type Heat } from '../../lib/lesson'

interface StreakBarProps {
  /** 0–1. */
  ratio: number
  /** Consecutive correct answers. Three sets the bar alight. */
  streak: number
  /** Fractions where later parts begin, drawn as notches. */
  marks?: number[]
  label: string
}

/** How each step of heat looks: thicker, faster, and a wider glow. */
const HEAT: Record<Exclude<Heat, 0>, { height: string; speed: string; glow: string }> = {
  1: {
    height: 'h-2',
    speed: '1.8s',
    glow: '0 0 10px rgba(255, 140, 0, 0.55)',
  },
  2: {
    height: 'h-2.5',
    speed: '1.2s',
    glow: '0 0 14px rgba(255, 110, 0, 0.7), 0 0 28px rgba(255, 69, 58, 0.35)',
  },
  3: {
    height: 'h-3',
    speed: '0.75s',
    glow: '0 0 18px rgba(255, 90, 0, 0.85), 0 0 42px rgba(255, 59, 48, 0.5)',
  },
}

const EMBERS = [
  { drift: '-6px', delay: '0s' },
  { drift: '5px', delay: '0.45s' },
  { drift: '-2px', delay: '0.85s' },
]

/**
 * The lesson's progress bar, which burns while the learner is on a run. The
 * flame rides the leading edge of the fill, so it reads as the bar itself
 * being on fire rather than a badge beside it.
 */
export function StreakBar({ ratio, streak, marks = [], label }: StreakBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, ratio)) * 1000) / 10
  const heat = heatOf(streak)
  const fire = heat === 0 ? null : HEAT[heat]

  return (
    <div
      className={`relative w-full transition-[height] duration-300 ${fire?.height ?? 'h-1.5'}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      aria-valuetext={fire ? `${Math.round(pct)}%, ${streak} in a row` : undefined}
    >
      <div className="absolute inset-0 rounded-full bg-white/10" />

      <div
        className={`absolute inset-y-0 left-0 rounded-full transition-[width,box-shadow] duration-500 ease-out ${
          fire ? 'fire-fill' : ''
        }`}
        style={{
          width: `${pct}%`,
          backgroundColor: fire ? undefined : 'var(--accent)',
          boxShadow: fire?.glow,
          ['--fire-speed' as string]: fire?.speed,
        }}
      />

      {/* Part boundaries, cut into the bar in the page colour. */}
      {marks.map((mark) => (
        <span
          key={mark}
          aria-hidden
          className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-canvas"
          style={{ left: `${mark * 100}%` }}
        />
      ))}

      {fire && pct > 0 && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-1/2 transition-[left] duration-500 ease-out"
          style={{ left: `${pct}%` }}
        >
          <FlameIcon
            className={`flame-flicker relative -left-1/2 block ${
              heat === 3 ? 'size-7' : heat === 2 ? 'size-6' : 'size-5'
            }`}
          />
          {heat >= 2 &&
            EMBERS.slice(0, heat === 3 ? 3 : 2).map((ember) => (
              <span
                key={ember.delay}
                className="ember absolute top-0 left-0 size-1 rounded-full bg-[#ffcc00]"
                style={{
                  animationDelay: ember.delay,
                  ['--drift' as string]: ember.drift,
                }}
              />
            ))}
        </span>
      )}
    </div>
  )
}
