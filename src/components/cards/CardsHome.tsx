import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import {
  CardsIcon,
  ChevronIcon,
  ImportIcon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  ShareIcon,
} from '../ui/Icons'
import { accentVars } from '../../lib/accent'
import { flattenModules, statusOf } from '../../lib/progress'
import { deckFromSet, type CardSet } from '../../lib/sets'
import { learnedDeck, moduleDeck, type Deck } from '../../lib/vocab'
import type { Course } from '../../types'

interface CardsHomeProps {
  course: Course
  completed: ReadonlySet<string>
  /** This course's sets. */
  sets: CardSet[]
  onStudy: (deck: Deck) => void
  onNewSet: () => void
  onEditSet: (setId: string) => void
  onShareSet: (setId: string) => void
  onImport: () => void
}

export function CardsHome({
  course,
  completed,
  sets,
  onStudy,
  onNewSet,
  onEditSet,
  onShareSet,
  onImport,
}: CardsHomeProps) {
  const learned = learnedDeck(course, completed)
  const refs = flattenModules(course)
  const setAccent = course.sections[0]?.accent ?? 'mint'

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-tight font-semibold text-ink">
          Flashcards
        </h1>
        <p className="text-[15px] text-muted">
          Review the {course.language} you’ve learned, or make a set to share
          with friends.
        </p>
      </header>

      {/* The main review pile, grown by every finished module. */}
      <button
        type="button"
        disabled={learned.cards.length === 0}
        onClick={() => onStudy(learned)}
        className="group flex items-center gap-5 rounded-card border border-[var(--accent)]/30 bg-[var(--accent)]/[0.07] p-5 text-left transition-all duration-200 hover:bg-[var(--accent)]/[0.11] active:scale-[0.99] disabled:pointer-events-none sm:p-6"
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-black">
          <CardsIcon className="size-7" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[17px] font-semibold text-ink">
            {learned.title}
          </span>
          <span className="text-[14px] text-muted">
            {learned.cards.length > 0
              ? `${learned.cards.length} cards from ${completed.size} finished ${completed.size === 1 ? 'module' : 'modules'}`
              : 'Finish a module and its words collect here.'}
          </span>
        </span>
        {learned.cards.length > 0 && (
          <ChevronIcon className="size-5 shrink-0 text-[var(--accent)] transition-transform group-hover:translate-x-0.5" />
        )}
      </button>

      <section className="flex flex-col gap-4" aria-labelledby="your-sets">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="your-sets" className="text-[20px] font-semibold text-ink">
            Your sets
          </h2>
          <div className="flex gap-2">
            <Button variant="neutral" size="sm" onClick={onImport}>
              <ImportIcon className="size-4" />
              Import
            </Button>
            <Button variant="accent" size="sm" onClick={onNewSet}>
              <PlusIcon className="size-4" />
              New set
            </Button>
          </div>
        </div>

        {sets.length === 0 ? (
          <button
            type="button"
            onClick={onNewSet}
            className="flex flex-col items-start gap-1.5 rounded-card border border-dashed border-hairline-strong p-6 text-left transition-colors hover:bg-white/[0.03]"
          >
            <span className="text-[15px] font-semibold text-ink">
              Make your first set
            </span>
            <span className="text-[14px] text-muted">
              Pick words from the course or write your own, then send a friend
              the link.
            </span>
          </button>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {sets.map((set) => (
              <li
                key={set.id}
                className="flex min-w-0 flex-col gap-4 rounded-card border border-hairline bg-elevated p-5 sheen"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="truncate text-[16px] font-semibold text-ink">
                    {set.name}
                  </p>
                  <p className="truncate text-[13px] text-faint">
                    {set.cards.length} cards ·{' '}
                    {set.cards
                      .slice(0, 3)
                      .map((card) => card.front)
                      .join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="accent"
                    size="sm"
                    className="flex-1"
                    onClick={() => onStudy(deckFromSet(set, setAccent))}
                  >
                    Study
                  </Button>
                  <IconButton label={`Share ${set.name}`} onClick={() => onShareSet(set.id)}>
                    <ShareIcon className="size-[18px]" />
                  </IconButton>
                  <IconButton label={`Edit ${set.name}`} onClick={() => onEditSet(set.id)}>
                    <PencilIcon className="size-[18px]" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-6" aria-labelledby="by-module">
        <h2 id="by-module" className="text-[20px] font-semibold text-ink">
          By module
        </h2>
        {course.sections.map((section) => (
          <div
            key={section.id}
            className="flex flex-col gap-2.5"
            style={accentVars(section.accent)}
          >
            <p className="text-[11px] font-semibold tracking-widest text-[var(--accent)] uppercase">
              {section.title}
            </p>
            <ul className="flex flex-col gap-2">
              {section.modules.map((module) => {
                const index = refs.findIndex((r) => r.module.id === module.id)
                const locked = statusOf(refs, completed, index) === 'locked'
                const deck = moduleDeck(module, section.accent)
                return (
                  <li key={module.id}>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => onStudy(deck)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-hairline bg-elevated px-4 py-3.5 text-left transition-colors hover:border-hairline-strong hover:bg-raised disabled:pointer-events-none disabled:opacity-45"
                    >
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[15px] font-medium text-ink">
                          {module.title}
                        </span>
                        <span className="text-[13px] text-faint">
                          {deck.cards.length} cards
                        </span>
                      </span>
                      {locked ? (
                        <LockIcon className="size-4 text-faint" />
                      ) : (
                        <ChevronIcon className="size-4 text-faint" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label.split(' ')[0]}
      onClick={onClick}
      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-raised text-muted transition-colors hover:bg-[#26262b] hover:text-ink"
    >
      {children}
    </button>
  )
}
