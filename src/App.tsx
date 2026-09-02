import { CourseView } from './components/CourseView'
import { useActiveCourse } from './hooks/useActiveCourse'
import { courses as allCourses } from './data/courses'
import type { Course } from './types'

interface AppProps {
  /** Swap in other content without touching any component. */
  courses?: Course[]
}

export default function App({ courses = allCourses }: AppProps) {
  const { course, select } = useActiveCourse(courses)

  if (!course) return null

  // Keyed on the course so switching language remounts the progress state and
  // the path, rather than reconciling one course's progress onto another's.
  return (
    <CourseView
      key={course.id}
      course={course}
      courses={courses}
      onSelectCourse={select}
    />
  )
}
