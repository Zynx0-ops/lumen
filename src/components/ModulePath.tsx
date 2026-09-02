import { ModuleNode, NODE_SIZE } from './ModuleNode'
import { ACCENTS, type Module, type ModuleStatus, type Section } from '../types'

/** Logical width of the path column; nodes are placed inside it in pixels. */
const COLUMN = 288
const ROW_HEIGHT = 152

/**
 * Horizontal offsets from the centre line, repeating every eight nodes to give
 * the path its gentle meander. Kept well inside COLUMN so no node clips.
 */
const OFFSETS = [0, 62, 88, 62, 0, -62, -88, -62]

function centreOf(index: number): { x: number; y: number } {
  return {
    x: COLUMN / 2 + OFFSETS[index % OFFSETS.length],
    y: NODE_SIZE / 2 + index * ROW_HEIGHT,
  }
}

export interface PathEntry {
  module: Module
  status: ModuleStatus
  isNext: boolean
}

interface ModulePathProps {
  section: Section
  entries: PathEntry[]
  onOpen: (module: Module) => void
}

export function ModulePath({ section, entries, onOpen }: ModulePathProps) {
  const height = (entries.length - 1) * ROW_HEIGHT + NODE_SIZE
  const accent = ACCENTS[section.accent]

  return (
    <div
      className="relative mx-auto"
      // Extra bottom room for the caption hanging below the final node.
      style={{ width: COLUMN, height: height + 40 }}
    >
      <svg
        className="absolute inset-0"
        width={COLUMN}
        height={height}
        viewBox={`0 0 ${COLUMN} ${height}`}
        fill="none"
        aria-hidden
      >
        {entries.slice(0, -1).map((entry, index) => {
          const from = centreOf(index)
          const to = centreOf(index + 1)
          const bend = (to.y - from.y) / 2

          // A segment lights up only once the module it leads out of is done,
          // so the accent trail traces exactly how far the learner has come.
          const travelled = entry.status === 'completed'

          return (
            <path
              key={entry.module.id}
              d={`M ${from.x} ${from.y} C ${from.x} ${from.y + bend}, ${to.x} ${to.y - bend}, ${to.x} ${to.y}`}
              stroke={travelled ? accent : 'rgba(255,255,255,0.07)'}
              strokeOpacity={travelled ? 0.45 : 1}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          )
        })}
      </svg>

      {entries.map((entry, index) => {
        const { x, y } = centreOf(index)
        return (
          <div
            key={entry.module.id}
            className="absolute"
            style={{
              left: x - NODE_SIZE / 2,
              top: y - NODE_SIZE / 2,
            }}
          >
            <ModuleNode
              module={entry.module}
              status={entry.status}
              isNext={entry.isNext}
              onOpen={() => onOpen(entry.module)}
            />
          </div>
        )
      })}
    </div>
  )
}
