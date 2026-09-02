import type { CSSProperties } from 'react'
import { ACCENTS, type AccentName } from '../types'

/**
 * Publishes a section's hue as `--accent` on a subtree. Components then use
 * `var(--accent)` in Tailwind arbitrary values, which keeps colours out of
 * conditional class strings.
 */
export function accentVars(accent: AccentName): CSSProperties {
  return { '--accent': ACCENTS[accent] } as CSSProperties
}
