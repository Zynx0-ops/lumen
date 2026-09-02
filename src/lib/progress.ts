import type { Course, Module, ModuleStatus, Section } from '../types'

/** A module together with the section it belongs to, in course order. */
export interface ModuleRef {
  section: Section
  module: Module
  /** Position in the flattened course, used for the unlock rule. */
  index: number
}

/** Every module in the course, flattened into the order it is worked through. */
export function flattenModules(course: Course): ModuleRef[] {
  const refs: ModuleRef[] = []
  for (const section of course.sections) {
    for (const module of section.modules) {
      refs.push({ section, module, index: refs.length })
    }
  }
  return refs
}

/**
 * Modules unlock strictly in sequence: the first one is always open, and every
 * other one opens as soon as the module before it is completed — including
 * across a section boundary.
 */
export function statusOf(
  refs: ModuleRef[],
  completed: ReadonlySet<string>,
  index: number,
): ModuleStatus {
  if (completed.has(refs[index].module.id)) return 'completed'
  if (index === 0) return 'available'
  return completed.has(refs[index - 1].module.id) ? 'available' : 'locked'
}

/** The module the learner should do next, or null once the course is finished. */
export function nextModule(
  refs: ModuleRef[],
  completed: ReadonlySet<string>,
): ModuleRef | null {
  return refs.find((ref) => !completed.has(ref.module.id)) ?? null
}

export interface Tally {
  done: number
  total: number
  /** 0–1, safe when total is 0. */
  ratio: number
}

function tally(modules: Module[], completed: ReadonlySet<string>): Tally {
  const done = modules.filter((m) => completed.has(m.id)).length
  return {
    done,
    total: modules.length,
    ratio: modules.length === 0 ? 0 : done / modules.length,
  }
}

export function sectionTally(
  section: Section,
  completed: ReadonlySet<string>,
): Tally {
  return tally(section.modules, completed)
}

export function courseTally(
  course: Course,
  completed: ReadonlySet<string>,
): Tally {
  return tally(
    course.sections.flatMap((s) => s.modules),
    completed,
  )
}

/** True once every module in the section before this one is done. */
export function isSectionLocked(
  course: Course,
  sectionIndex: number,
  completed: ReadonlySet<string>,
): boolean {
  if (sectionIndex === 0) return false
  const previous = course.sections[sectionIndex - 1]
  return sectionTally(previous, completed).done < previous.modules.length
}
