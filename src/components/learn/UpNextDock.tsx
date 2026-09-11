import { Button } from '../ui/Button'
import { ChevronIcon } from '../ui/Icons'
import type { ModuleRef } from '../../lib/progress'

interface UpNextDockProps {
  next: ModuleRef
  started: boolean
  onContinue: () => void
}

/** The phone's version of the sidebar's continue card, above the tab bar. */
export function UpNextDock({ next, started, onContinue }: UpNextDockProps) {
  return (
    <div className="border-b border-hairline px-4 py-2.5">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-medium tracking-widest text-faint uppercase">
            {started ? 'Up next' : 'Begin here'}
          </span>
          <span className="truncate text-[15px] font-semibold text-ink">
            {next.module.title}
          </span>
        </div>
        <Button variant="accent" size="sm" onClick={onContinue} className="shrink-0">
          {started ? 'Continue' : 'Start'}
          <ChevronIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
