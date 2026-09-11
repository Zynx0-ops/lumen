import type { AccentName } from '../types'
import type { Card, Deck } from './vocab'

/** A flashcard set the learner made, or imported from a friend's link. */
export interface CardSet {
  id: string
  courseId: string
  name: string
  cards: Card[]
  updatedAt: number
}

/**
 * Caps that apply everywhere a set enters the app — typed in, loaded from
 * storage, or decoded from a stranger's link — so a hostile or corrupt set
 * can't balloon storage or the page.
 */
export const SET_LIMITS = { name: 60, cards: 200, side: 160 } as const

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/** Keeps only complete cards, trimmed and capped. */
export function cleanCards(cards: unknown): Card[] {
  if (!Array.isArray(cards)) return []
  const out: Card[] = []
  for (const card of cards) {
    if (out.length >= SET_LIMITS.cards) break
    const pair = Array.isArray(card)
      ? { front: card[0], back: card[1] }
      : (card as Partial<Card> | null)
    const front = cleanText(pair?.front, SET_LIMITS.side)
    const back = cleanText(pair?.back, SET_LIMITS.side)
    if (front && back) out.push({ front, back })
  }
  return out
}

/** Validates anything claiming to be a set; null when it isn't usable. */
export function parseSet(value: unknown): CardSet | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Record<string, unknown>
  const name = cleanText(raw.name, SET_LIMITS.name)
  const courseId = cleanText(raw.courseId, 40)
  const cards = cleanCards(raw.cards)
  if (!name || !courseId || cards.length === 0) return null
  return {
    id: cleanText(raw.id, 64) || newSetId(),
    courseId,
    name,
    cards,
    updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now(),
  }
}

export function newSetId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `set-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function deckFromSet(set: CardSet, accent: AccentName): Deck {
  return {
    id: set.id,
    title: set.name,
    subtitle: `${set.cards.length} cards`,
    accent,
    cards: set.cards,
  }
}
