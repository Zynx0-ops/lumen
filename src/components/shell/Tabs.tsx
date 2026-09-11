import { CardsIcon, PathIcon } from '../ui/Icons'

export type Tab = 'learn' | 'cards'

const TABS = [
  { id: 'learn', label: 'Learn', Icon: PathIcon },
  { id: 'cards', label: 'Cards', Icon: CardsIcon },
] as const

interface TabsProps {
  tab: Tab
  onTab: (tab: Tab) => void
}

/** Desktop: a segmented control under the language picker. */
export function TabNav({ tab, onTab }: TabsProps) {
  return (
    <nav
      aria-label="App"
      className="grid grid-cols-2 gap-1 rounded-2xl border border-hairline bg-elevated p-1"
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = tab === id
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onTab(id)}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-[14px] font-medium transition-all duration-200 ${
              active
                ? 'bg-raised text-ink shadow-[0_2px_10px_-4px_rgba(0,0,0,0.8)]'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Icon
              className={`size-4 transition-colors ${active ? 'text-[var(--accent)]' : ''}`}
            />
            {label}
          </button>
        )
      })}
    </nav>
  )
}

/** Mobile: a tab bar pinned to the bottom edge. */
export function TabBar({ tab, onTab }: TabsProps) {
  return (
    <nav
      aria-label="App"
      className="grid grid-cols-2 pb-[env(safe-area-inset-bottom)]"
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = tab === id
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onTab(id)}
            className={`flex flex-col items-center gap-1 pt-2 pb-2.5 text-[11px] font-medium transition-colors ${
              active ? 'text-[var(--accent)]' : 'text-faint'
            }`}
          >
            <Icon className="size-6" />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
