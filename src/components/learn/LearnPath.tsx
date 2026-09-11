import { ModulePath, type PathEntry } from './ModulePath'
import { SectionHeader } from './SectionHeader'
import { accentVars } from '../../lib/accent'
import { isSectionLocked, sectionTally } from '../../lib/progress'
import type { Course, Module, Section } from '../../types'

interface LearnPathProps {
  course: Course
  completed: ReadonlySet<string>
  /** Every node's state, keyed by module id. */
  entries: Map<string, PathEntry>
  finished: boolean
  onOpenModule: (section: Section, module: Module) => void
}

/** Every section, each drawn as a meandering path of module nodes. */
export function LearnPath({
  course,
  completed,
  entries,
  finished,
  onOpenModule,
}: LearnPathProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-14">
      {course.sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="flex scroll-mt-24 flex-col gap-10"
          style={accentVars(section.accent)}
        >
          <SectionHeader
            section={section}
            index={index}
            tally={sectionTally(section, completed)}
            locked={isSectionLocked(course, index, completed)}
          />
          <ModulePath
            section={section}
            entries={section.modules.map((m) => entries.get(m.id)!)}
            onOpen={(module) => onOpenModule(section, module)}
          />
        </section>
      ))}

      <p className="pb-4 text-center text-[13px] text-faint">
        {finished
          ? 'You have reached the end of the course.'
          : 'More sections unlock as you go.'}
      </p>
    </div>
  )
}
