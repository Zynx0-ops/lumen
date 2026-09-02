import { japanese } from './japanese'
import { latin } from './latin'
import { spanish } from './spanish'
import type { Course } from '../types'

/**
 * Every course the app offers. The first is the one a new learner lands on.
 *
 * To add a language, write a file next to these three matching the `Course`
 * shape in `src/types.ts` and add it to this array — nothing else needs to
 * change. Progress is stored per course id, so courses never collide.
 */
export const courses: Course[] = [spanish, latin, japanese]
