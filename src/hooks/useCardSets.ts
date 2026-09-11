import { useCallback, useState } from 'react'
import { readSets, writeSets } from '../lib/storage'
import type { CardSet } from '../lib/sets'

/**
 * Flashcard sets for every course, persisted. Writes happen in the handlers
 * rather than an effect, so a save is on disk before any navigation after it.
 */
export function useCardSets() {
  const [sets, setSets] = useState<CardSet[]>(readSets)

  const commit = useCallback((next: CardSet[]) => {
    setSets(next)
    writeSets(next)
  }, [])

  const saveSet = useCallback(
    (set: CardSet) => {
      const stamped = { ...set, updatedAt: Date.now() }
      const exists = sets.some((s) => s.id === set.id)
      commit(
        exists
          ? sets.map((s) => (s.id === set.id ? stamped : s))
          : [stamped, ...sets],
      )
    },
    [commit, sets],
  )

  const deleteSet = useCallback(
    (id: string) => commit(sets.filter((s) => s.id !== id)),
    [commit, sets],
  )

  return { sets, saveSet, deleteSet }
}
