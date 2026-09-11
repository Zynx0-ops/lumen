import { useId, type CSSProperties } from 'react'

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

/** Two-tone flame. Gradient ids are per instance so several can share a page. */
export function FlameIcon({ className, style }: IconProps) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} style={style}>
      <defs>
        <linearGradient id={`${id}-outer`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff3b30" />
          <stop offset="1" stopColor="#ff9f0a" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff9f0a" />
          <stop offset="1" stopColor="#ffe066" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id}-outer)`}
        d="M12 1.8c.7 3.3 3.2 5 4.9 7.5 1.4 2.1 2.2 4.1 1.9 6.4C18.4 19.5 15.6 22 12 22s-6.5-2.5-6.8-6.4c-.2-2.7 1-5 2.7-6.9.2 1.6.9 2.9 2.2 3.6C9.7 8.6 10.3 5 12 1.8z"
      />
      <path
        fill={`url(#${id}-inner)`}
        d="M12 11.2c.5 1.8 1.8 2.7 2.5 4 .6 1.1.7 2.3.4 3.3-.4 1.4-1.6 2.3-2.9 2.3s-2.6-.9-2.9-2.4c-.3-1.3.2-2.7 1.1-3.7.1.8.5 1.5 1.2 1.8-.1-1.9.1-3.6.6-5.3z"
      />
    </svg>
  )
}

function Stroke({ className, style, d }: IconProps & { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className} style={style}>
      <path d={d} stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** A winding route with stops — the Learn tab. */
export function PathIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={props.className} style={props.style}>
      <path d="M7 19.5c4.5 0 10-1.2 10-4.5S7 11.5 7 8.5 11 4.5 17 4.5" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" />
      <circle cx="6" cy="19.5" r="2" fill="currentColor" />
      <circle cx="18" cy="4.5" r="2" fill="currentColor" />
    </svg>
  )
}

/** A card with another behind it — the Cards tab. */
export function CardsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={props.className} style={props.style}>
      <rect x="3.5" y="7" width="13" height="14" rx="2.6" stroke="currentColor" strokeWidth={1.9} />
      <path d="M8 3.5h9.9A2.6 2.6 0 0 1 20.5 6.1V16" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" />
    </svg>
  )
}

export const PlusIcon = (p: IconProps) => <Stroke {...p} d="M12 5v14M5 12h14" />
export const ShareIcon = (p: IconProps) => (
  <Stroke {...p} d="M12 3.5v11M8 7.2l4-3.7 4 3.7M6.5 11H6a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 18 11h-.5" />
)
export const ImportIcon = (p: IconProps) => (
  <Stroke {...p} d="M12 3.5v11M8 10.8l4 3.7 4-3.7M4.5 15.5v3A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
)
export const TrashIcon = (p: IconProps) => (
  <Stroke {...p} d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M6.5 7l.8 11.6A1.5 1.5 0 0 0 8.8 20h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
)
export const CopyIcon = (p: IconProps) => (
  <Stroke {...p} d="M9 9h9.5v11H9zM15 9V5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15H9" />
)
export const ShuffleIcon = (p: IconProps) => (
  <Stroke {...p} d="M4 7h3.5c4 0 5 10 9 10H20M17 14l3 3-3 3M4 17h3.5c1.4 0 2.4-1.2 3.3-2.8M13.2 9.8C14.1 8.2 15.1 7 16.5 7H20M17 4l3 3-3 3" />
)
export const SwapIcon = (p: IconProps) => (
  <Stroke {...p} d="M7 4.5 3.5 8 7 11.5M3.5 8h13M17 12.5l3.5 3.5-3.5 3.5M20.5 16h-13" />
)
export const SearchIcon = (p: IconProps) => <Stroke {...p} d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.3 15.3 20 20" />
export const PencilIcon = (p: IconProps) => <Stroke {...p} d="M4.5 19.5l1-4L15.8 5.2a2 2 0 0 1 2.9 0l.1.1a2 2 0 0 1 0 2.9L8.5 18.5l-4 1zM13.5 7.5l3 3" />
