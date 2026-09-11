import { useState } from 'react'
import { WordPicker } from './WordPicker'
import { Button } from '../ui/Button'
import { CloseIcon, PlusIcon, SearchIcon, TrashIcon } from '../ui/Icons'
import { accentVars } from '../../lib/accent'
import { normalise } from '../../lib/grade'
import { cleanCards, newSetId, SET_LIMITS, type CardSet } from '../../lib/sets'
import { courseCards, type Card } from '../../lib/vocab'
import type { Course } from '../../types'

interface SetEditorProps {
  course: Course
  /** The set being edited, or null to make a new one. */
  set: CardSet | null
  onSave: (set: CardSet) => void
  onDelete: (setId: string) => void
  onClose: () => void
}

interface Row extends Card {
  key: string
}

let rowCounter = 0
const row = (card: Card = { front: '', back: '' }): Row => ({
  ...card,
  key: `row-${++rowCounter}`,
})

export function SetEditor({ course, set, onSave, onDelete, onClose }: SetEditorProps) {
  const [name, setName] = useState(set?.name ?? '')
  const [rows, setRows] = useState<Row[]>(() =>
    set ? set.cards.map((c) => row(c)) : [row()],
  )
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const [picking, setPicking] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const complete = rows.filter((r) => r.front.trim() && r.back.trim())
  const partial = rows.filter((r) => (r.front.trim() || r.back.trim()) && !(r.front.trim() && r.back.trim()))
  const canSave = name.trim().length > 0 && complete.length > 0
  const full = rows.length >= SET_LIMITS.cards
  const accent = course.sections[0]?.accent ?? 'mint'

  function update(key: string, field: 'front' | 'back', value: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    if (full) return
    const fresh = row()
    setRows((prev) => [...prev, fresh])
    setFocusKey(fresh.key)
  }

  function removeRow(key: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : [row()]))
  }

  function addWords(cards: Card[]) {
    setRows((prev) => {
      // Replace a lone blank row rather than leaving it stranded at the top.
      const kept = prev.filter((r) => r.front.trim() || r.back.trim())
      return [...kept, ...cards.map((c) => row(c))].slice(0, SET_LIMITS.cards)
    })
    setPicking(false)
  }

  function save() {
    if (!canSave) return
    onSave({
      id: set?.id ?? newSetId(),
      courseId: course.id,
      name: name.trim().slice(0, SET_LIMITS.name),
      cards: cleanCards(complete),
      updatedAt: Date.now(),
    })
  }

  const inSet = new Set(rows.map((r) => normalise(r.front)).filter(Boolean))

  return (
    <div className="min-h-dvh bg-canvas" style={accentVars(accent)}>
      <header className="sticky top-0 z-20 border-b border-hairline bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close without saving"
            className="-ml-1.5 rounded-full p-1.5 text-faint transition-colors hover:text-ink"
          >
            <CloseIcon className="size-5" />
          </button>
          <h1 className="flex-1 text-[17px] font-semibold text-ink">
            {set ? 'Edit set' : 'New set'}
          </h1>
          <Button variant="accent" size="sm" disabled={!canSave} onClick={save}>
            Save
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 pt-8 pb-24 sm:px-6">
        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium tracking-widest text-faint uppercase">
            Set name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={SET_LIMITS.name}
            placeholder={`e.g. ${course.language} food words`}
            autoFocus={!set}
            className="border-b-2 border-hairline-strong bg-transparent pb-2 text-[26px] font-semibold text-ink caret-[var(--accent)] placeholder:text-faint outline-none transition-colors focus:border-[var(--accent)]"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-muted">
            <span className="font-semibold text-ink tabular-nums">{complete.length}</span>{' '}
            {complete.length === 1 ? 'card' : 'cards'}
            {full && ' · set is full'}
          </p>
          <Button variant="neutral" size="sm" disabled={full} onClick={() => setPicking(true)}>
            <SearchIcon className="size-4" />
            Add course words
          </Button>
        </div>

        <ol className="flex flex-col gap-2.5">
          {rows.map((r, i) => (
            <li
              key={r.key}
              className="flex items-start gap-2 rounded-2xl border border-hairline bg-elevated p-2.5"
            >
              <span className="w-6 shrink-0 pt-3 text-center text-[12px] tabular-nums text-faint">
                {i + 1}
              </span>
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                <input
                  value={r.front}
                  onChange={(e) => update(r.key, 'front', e.target.value)}
                  maxLength={SET_LIMITS.side}
                  placeholder={course.language}
                  aria-label={`Card ${i + 1}, ${course.language}`}
                  autoFocus={r.key === focusKey}
                  className="min-w-0 rounded-xl border border-transparent bg-raised px-3 py-2.5 text-[15px] text-ink placeholder:text-faint outline-none focus:border-[var(--accent)]"
                />
                <input
                  value={r.back}
                  onChange={(e) => update(r.key, 'back', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && i === rows.length - 1) addRow()
                  }}
                  maxLength={SET_LIMITS.side}
                  placeholder="English"
                  aria-label={`Card ${i + 1}, English`}
                  className="min-w-0 rounded-xl border border-transparent bg-raised px-3 py-2.5 text-[15px] text-ink placeholder:text-faint outline-none focus:border-[var(--accent)]"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(r.key)}
                aria-label={`Remove card ${i + 1}`}
                className="mt-1 rounded-lg p-2 text-faint transition-colors hover:bg-wrong/10 hover:text-wrong"
              >
                <TrashIcon className="size-[18px]" />
              </button>
            </li>
          ))}
        </ol>

        <Button variant="ghost" block disabled={full} onClick={addRow}>
          <PlusIcon className="size-4" />
          Add a card
        </Button>

        {partial.length > 0 && (
          <p className="-mt-4 text-center text-[13px] text-faint">
            {partial.length} {partial.length === 1 ? 'card is' : 'cards are'} missing a side
            and won’t be saved.
          </p>
        )}

        {set && (
          <button
            type="button"
            onClick={() => (confirmDelete ? onDelete(set.id) : setConfirmDelete(true))}
            onBlur={() => setConfirmDelete(false)}
            className={`mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-medium transition-colors ${
              confirmDelete ? 'bg-wrong/12 text-wrong' : 'text-faint hover:bg-white/5 hover:text-wrong'
            }`}
          >
            <TrashIcon className="size-4" />
            {confirmDelete ? 'Tap again to delete this set' : 'Delete set'}
          </button>
        )}
      </main>

      {picking && (
        <WordPicker
          cards={courseCards(course)}
          existing={inSet}
          room={SET_LIMITS.cards - complete.length}
          onAdd={addWords}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  )
}
