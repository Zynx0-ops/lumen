import { Button } from '../ui/Button'
import { ImportIcon, PlusIcon } from '../ui/Icons'

interface CardsSidebarProps {
  learnedCount: number
  setCount: number
  onNewSet: () => void
  onImport: () => void
}

export function CardsSidebar({
  learnedCount,
  setCount,
  onNewSet,
  onImport,
}: CardsSidebarProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-card border border-hairline bg-elevated p-4 sheen">
          <p className="text-[26px] font-semibold tabular-nums text-ink">
            {learnedCount}
          </p>
          <p className="text-[12px] text-faint">words learned</p>
        </div>
        <div className="rounded-card border border-hairline bg-elevated p-4 sheen">
          <p className="text-[26px] font-semibold tabular-nums text-ink">
            {setCount}
          </p>
          <p className="text-[12px] text-faint">
            {setCount === 1 ? 'set' : 'sets'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="accent" block onClick={onNewSet}>
          <PlusIcon className="size-4" />
          New set
        </Button>
        <Button variant="neutral" block onClick={onImport}>
          <ImportIcon className="size-4" />
          Import a set
        </Button>
      </div>

      <p className="mt-auto px-1 text-[12px] leading-relaxed text-faint">
        Sets are shared as links. Nothing is uploaded — the whole set travels
        inside the link itself.
      </p>
    </>
  )
}
