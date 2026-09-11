import { normalise } from './grade'
import type { AccentName, Course, Exercise, Module } from '../types'

/** One flashcard: the language being learned on the front, English behind. */
export interface Card {
  front: string
  back: string
}

export interface Deck {
  id: string
  title: string
  subtitle: string
  accent: AccentName
  cards: Card[]
}

/** Every exercise in a module, in lesson order. */
export function exercisesOf(module: Module): Exercise[] {
  return module.parts.flatMap((part) => part.exercises)
}

/**
 * Cards come from two reliable places: matching pairs, which are always
 * word → translation, and blanks filled in with their answer, which make
 * sentence cards. Multiple choice is left out because its question runs in
 * either direction, so which side is the target language isn't known.
 *
 * Repeats — "gracias" is matched in more than one module — are dropped by
 * their normalised front.
 */
export function cardsFrom(exercises: Exercise[]): Card[] {
  const seen = new Set<string>()
  const cards: Card[] = []

  function add(front: string, back: string) {
    const key = normalise(front)
    if (!key || seen.has(key)) return
    seen.add(key)
    cards.push({ front, back })
  }

  for (const exercise of exercises) {
    if (exercise.type === 'matching') {
      for (const pair of exercise.pairs) add(pair.left, pair.right)
    } else if (exercise.type === 'fill-blank' && exercise.translation) {
      add(exercise.sentence.replace('___', exercise.answer), exercise.translation)
    }
  }
  return cards
}

/** Just the word cards — matching pairs — for showing what a part taught. */
export function wordsFrom(exercises: Exercise[]): string[] {
  return cardsFrom(exercises.filter((e) => e.type === 'matching')).map(
    (card) => card.front,
  )
}

export function moduleDeck(module: Module, accent: AccentName): Deck {
  const cards = cardsFrom(exercisesOf(module))
  return {
    id: module.id,
    title: module.title,
    subtitle: `${cards.length} cards`,
    accent,
    cards,
  }
}

/** Everything from the modules already finished — the main review pile. */
export function learnedDeck(
  course: Course,
  completed: ReadonlySet<string>,
): Deck {
  const modules = course.sections.flatMap((s) => s.modules)
  const cards = cardsFrom(
    modules.filter((m) => completed.has(m.id)).flatMap(exercisesOf),
  )
  return {
    id: `${course.id}-learned`,
    title: 'Everything you’ve learned',
    subtitle: `${cards.length} cards`,
    accent: course.sections[0]?.accent ?? 'mint',
    cards,
  }
}

/** Every card in the course, for building a set out of course words. */
export function courseCards(course: Course): Card[] {
  return cardsFrom(
    course.sections.flatMap((s) => s.modules).flatMap(exercisesOf),
  )
}
