import { useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { Sheet } from '../ui/Sheet'
import { decodeSet, extractCode, type SharedSet } from '../../lib/share'
import type { CardSet } from '../../lib/sets'
import { ACCENTS, type Course } from '../../types'

interface ImportSheetProps {
  courses: Course[]
  sets: CardSet[]
  /** A set that arrived by link, or 'invalid' when that link couldn't be read. */
  incoming: SharedSet | 'invalid' | null
  onImport: (shared: SharedSet) => void
  onClose: () => void
}

type Result =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'invalid' }
  | { status: 'ready'; set: SharedSet }

export function ImportSheet({ courses, sets, incoming, onImport, onClose }: ImportSheetProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Result>(() =>
    incoming === 'invalid'
      ? { status: 'invalid' }
      : incoming
        ? { status: 'ready', set: incoming }
        : { status: 'idle' },
  )
  const latest = useRef(0)

  // Decoding is async; only the newest paste is allowed to land.
  async function onInput(value: string) {
    setInput(value)
    const token = ++latest.current
    if (!value.trim()) return setResult({ status: 'idle' })
    const code = extractCode(value)
    if (!code) return setResult({ status: 'invalid' })
    setResult({ status: 'checking' })
    const shared = await decodeSet(code)
    if (token === latest.current) {
      setResult(shared ? { status: 'ready', set: shared } : { status: 'invalid' })
    }
  }

  const shared = result.status === 'ready' ? result.set : null
  const course = shared ? courses.find((c) => c.id === shared.courseId) : undefined
  const duplicate =
    shared !== null &&
    sets.some(
      (s) =>
        s.courseId === shared.courseId &&
        s.name === shared.name &&
        s.cards.length === shared.cards.length,
    )

  return (
    <Sheet
      title={incoming && incoming !== 'invalid' ? 'A friend shared a set' : 'Import a set'}
      onClose={onClose}
      footer={
        <Button
          variant="accent"
          block
          disabled={!shared || !course}
          onClick={() => shared && onImport(shared)}
        >
          {duplicate ? 'Add another copy' : 'Add to my sets'}
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {!(incoming && incoming !== 'invalid') && (
          <label className="flex flex-col gap-2">
            <span className="text-[14px] text-muted">
              Paste the link or code a friend sent you.
            </span>
            <textarea
              value={input}
              onChange={(e) => onInput(e.target.value)}
              rows={3}
              autoFocus
              spellCheck={false}
              placeholder="https://…#set=L1… or L1…"
              className="w-full resize-none rounded-xl border border-hairline bg-canvas px-3.5 py-3 font-mono text-[13px] text-ink placeholder:text-faint outline-none focus:border-[var(--accent)]"
            />
          </label>
        )}

        {result.status === 'checking' && (
          <p className="text-[14px] text-faint">Reading the set…</p>
        )}
        {result.status === 'invalid' && (
          <p className="text-[14px] text-wrong">
            {incoming === 'invalid'
              ? 'That link doesn’t contain a set Lumen can read. Ask your friend to copy it again, or paste the code below.'
              : 'That doesn’t look like a Lumen set. Check you copied the whole link or code.'}
          </p>
        )}

        {shared && (
          <div className="flex animate-rise flex-col gap-4 rounded-2xl border border-hairline bg-raised p-4">
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-elevated text-[13px] font-bold"
                style={{ color: course ? ACCENTS[course.sections[0]?.accent ?? 'mint'] : undefined }}
              >
                {course?.code ?? '??'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold text-ink">{shared.name}</p>
                <p className="text-[13px] text-muted">
                  {course?.language ?? 'Unknown language'} · {shared.cards.length}{' '}
                  {shared.cards.length === 1 ? 'card' : 'cards'}
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5">
              {shared.cards.slice(0, 4).map((card, i) => (
                <li key={i} className="flex gap-2 text-[14px]">
                  <span className="min-w-0 flex-1 truncate text-ink">{card.front}</span>
                  <span className="min-w-0 flex-1 truncate text-faint">{card.back}</span>
                </li>
              ))}
            </ul>
            {shared.cards.length > 4 && (
              <p className="text-[13px] text-faint">and {shared.cards.length - 4} more</p>
            )}
          </div>
        )}

        {shared && !course && (
          <p className="text-[13px] text-[#ff9f0a]">
            This set is for a course this copy of Lumen doesn’t have.
          </p>
        )}
        {duplicate && (
          <p className="text-[13px] text-faint">You already have a set with this name.</p>
        )}
      </div>
    </Sheet>
  )
}
