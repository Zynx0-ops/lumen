import { useMemo, useState } from 'react'
import { Button } from '../ui/Button'
import { CheckIcon, SearchIcon } from '../ui/Icons'
import { Sheet } from '../ui/Sheet'
import { normalise } from '../../lib/grade'
import type { Card } from '../../lib/vocab'

interface WordPickerProps {
  cards: Card[]
  /** Normalised fronts already in the set; shown ticked and fixed. */
  existing: ReadonlySet<string>
  /** How many more cards the set can take. */
  room: number
  onAdd: (cards: Card[]) => void
  onClose: () => void
}

export function WordPicker({ cards, existing, room, onAdd, onClose }: WordPickerProps) {
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<Set<string>>(new Set())

  const shown = useMemo(() => {
    const needle = normalise(query)
    return needle
      ? cards.filter((c) => normalise(`${c.front} ${c.back}`).includes(needle))
      : cards
  }, [cards, query])

  const selectable = shown.filter((c) => !existing.has(normalise(c.front)))
  const allShownPicked =
    selectable.length > 0 && selectable.every((c) => picked.has(normalise(c.front)))

  function toggle(key: string) {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else if (next.size < room) next.add(key)
      return next
    })
  }

  function toggleAllShown() {
    setPicked((prev) => {
      const next = new Set(prev)
      for (const card of selectable) {
        const key = normalise(card.front)
        if (allShownPicked) next.delete(key)
        else if (next.size < room) next.add(key)
      }
      return next
    })
  }

  return (
    <Sheet
      title="Add course words"
      onClose={onClose}
      footer={
        <Button
          variant="accent"
          block
          disabled={picked.size === 0}
          onClick={() => onAdd(cards.filter((c) => picked.has(normalise(c.front))))}
        >
          {picked.size === 0
            ? 'Pick some words'
            : `Add ${picked.size} ${picked.size === 1 ? 'card' : 'cards'}`}
        </Button>
      }
    >
      <div className="sticky top-0 z-10 -mx-5 flex flex-col gap-3 bg-elevated px-5 pb-3">
        <label className="flex items-center gap-2.5 rounded-xl border border-hairline bg-raised px-3.5 py-2.5 focus-within:border-[var(--accent)]">
          <SearchIcon className="size-4 shrink-0 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words or meanings"
            aria-label="Search words"
            autoFocus
            className="w-full bg-transparent text-[15px] text-ink placeholder:text-faint outline-none"
          />
        </label>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-faint">
            {shown.length} {shown.length === 1 ? 'word' : 'words'}
          </span>
          {selectable.length > 0 && (
            <button
              type="button"
              onClick={toggleAllShown}
              className="font-medium text-[var(--accent)] hover:underline"
            >
              {allShownPicked ? 'Clear these' : 'Select all shown'}
            </button>
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {shown.map((card) => {
          const key = normalise(card.front)
          const already = existing.has(key)
          const on = already || picked.has(key)
          return (
            <li key={key}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                disabled={already}
                onClick={() => toggle(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  on && !already ? 'bg-[var(--accent)]/10' : 'hover:bg-white/5'
                } disabled:opacity-50`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    on ? 'border-transparent bg-[var(--accent)] text-black' : 'border-hairline-strong'
                  }`}
                >
                  {on && <CheckIcon className="size-3.5" />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[15px] text-ink">{card.front}</span>
                  <span className="truncate text-[13px] text-faint">
                    {already ? 'Already in this set' : card.back}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
        {shown.length === 0 && (
          <li className="py-8 text-center text-[14px] text-faint">
            No words match “{query}”.
          </li>
        )}
      </ul>
    </Sheet>
  )
}
