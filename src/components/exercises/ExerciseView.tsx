import { FillBlank } from './FillBlank'
import { Matching } from './Matching'
import { MultipleChoice } from './MultipleChoice'
import type { ExerciseProps } from './types'

/** Routes to the component for the exercise type, narrowing as it goes. */
export function ExerciseView({ exercise, ...rest }: ExerciseProps) {
  switch (exercise.type) {
    case 'multiple-choice':
      return <MultipleChoice exercise={exercise} {...rest} />
    case 'fill-blank':
      return <FillBlank exercise={exercise} {...rest} />
    case 'matching':
      return <Matching exercise={exercise} {...rest} />
  }
}
