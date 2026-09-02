interface ProgressBarProps {
  /** 0–1. */
  ratio: number
  className?: string
  /** Colour of the filled portion; defaults to the ambient accent. */
  color?: string
  label?: string
}

/** A hairline track that fills with the accent — the app's only chrome. */
export function ProgressBar({
  ratio,
  className = '',
  color = 'var(--accent)',
  label,
}: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, ratio)) * 100)

  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-white/10 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}
