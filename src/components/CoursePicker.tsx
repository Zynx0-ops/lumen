import { useEffect, useRef, useState } from 'react'
import { CheckIcon, ChevronIcon } from './ui/Icons'
import type { Tally } from '../lib/progress'
import { ACCENTS, type Course } from '../types'

interface CoursePickerProps {
  courses: Course[]
  active: Course
  /** Module counts per course id, so the list can show where you left off. */
  tallies: Map<string, Tally>
  onSelect: (courseId: string) => void
  /** Badge-only trigger for the mobile header. */
  compact?: boolean
}

/** A course's badge takes the hue of its opening section. */
function badgeAccent(course: Course): string {
  return ACCENTS[course.sections[0]?.accent ?? 'mint']
}

export function CoursePicker({
  courses,
  active,
  tallies,
  onSelect,
  compact = false,
}: CoursePickerProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  // Dismiss on outside click or Escape — no backdrop, nothing to trap focus in.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(courseId: string) {
    setOpen(false)
    if (courseId !== active.id) onSelect(courseId)
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Learning ${active.language}. Change language`}
        className={`flex items-center rounded-2xl transition-colors duration-200 hover:bg-white/5 ${
          compact ? 'gap-1 p-1' : '-ml-2 gap-3.5 p-2'
        } ${open ? 'bg-white/5' : ''}`}
      >
        <span
          className={`flex shrink-0 items-center justify-center rounded-xl border border-hairline bg-elevated font-bold tracking-tight sheen ${
            compact ? 'size-9 text-[13px]' : 'size-11 rounded-2xl text-[15px]'
          }`}
          style={{ color: badgeAccent(active) }}
        >
          {active.code}
        </span>

        {!compact && (
          <span className="flex flex-col items-start">
            <span className="text-[11px] font-medium tracking-widest text-faint uppercase">
              Learning
            </span>
            <span className="text-[17px] font-semibold text-ink">
              {active.language}
            </span>
          </span>
        )}

        <ChevronIcon
          className={`size-4 shrink-0 text-faint transition-transform duration-200 ${
            open ? 'rotate-90' : 'rotate-90 opacity-60'
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language"
          className="absolute top-full left-0 z-50 mt-2 w-64 animate-pop rounded-[20px] border border-hairline-strong bg-raised p-1.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] sheen"
        >
          {courses.map((course) => {
            const tally = tallies.get(course.id)
            const isActive = course.id === active.id
            return (
              <button
                key={course.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => choose(course.id)}
                className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-white/5"
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-hairline bg-elevated text-[12px] font-bold"
                  style={{ color: badgeAccent(course) }}
                >
                  {course.code}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[15px] font-semibold text-ink">
                    {course.language}
                  </span>
                  <span className="text-[12px] tabular-nums text-faint">
                    {tally
                      ? `${tally.done} of ${tally.total} modules`
                      : 'Not started'}
                  </span>
                </span>
                {/* The current course is ticked in its own colour. */}
                {isActive && (
                  <CheckIcon
                    className="size-4 shrink-0"
                    style={{ color: badgeAccent(course) }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
