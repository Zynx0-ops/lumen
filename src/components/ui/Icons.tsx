import type { CSSProperties } from 'react'

interface IconProps {
  className?: string
  style?: CSSProperties
}

/**
 * Hairline SF-Symbols-ish glyphs. All drawn on a 24×24 grid with round caps so
 * they sit consistently next to text at any size.
 */

export function CheckIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className} style={style}>
      <path
        d="M5 12.8 9.6 17.4 19 7"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect
        x="5"
        y="10.5"
        width="14"
        height="10"
        rx="3"
        stroke="currentColor"
        strokeWidth={1.9}
      />
      <path
        d="M8.5 10.5V7.8a3.5 3.5 0 1 1 7 0v2.7"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2.6l2.7 5.9 6.4.75-4.75 4.37 1.28 6.33L12 16.8l-5.63 3.15 1.28-6.33L2.9 9.25l6.4-.75L12 2.6z" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6"
        stroke="currentColor"
        strokeWidth={2.1}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M9 5.5 15.5 12 9 18.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.4 2 5 13.4h5.2L9.9 22l8.6-11.6h-5.4L13.4 2z" />
    </svg>
  )
}

export function UndoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 5.5v5h5"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.6 10.4a8 8 0 1 1 .4 5.2"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
      />
    </svg>
  )
}
