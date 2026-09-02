# Lumen

A minimalist language-learning app: sections of modules laid out on a
progression path, worked through one exercise at a time. Ships with three
courses — **Spanish**, **Latin** and **Japanese** — 13 modules and 65 exercises
each.

Dark, high-contrast, and deliberately quiet — depth comes from hairlines and
soft shadows rather than dividers, and each section's accent colour is the only
strong hue on screen.

```bash
npm install && npm run dev
```

## The learning flow

- **Path** — sections stacked vertically, each drawn as a meandering path of
  module nodes. A node is locked, available, or completed, and the connector
  behind it lights up in the section's accent as you advance.
- **Lesson** — a full-screen player that shows one exercise at a time, grades
  it, and explains the answer before moving on.
- **Languages** — a picker in the sidebar (a badge in the mobile header) swaps
  courses. Each language keeps its own progress, so you can hold three in
  flight at once, and the app reopens on whichever you used last.

Modules unlock strictly in sequence, including across section boundaries:
finishing the last module of a section opens the first module of the next one.

Completed module ids live in `localStorage`, keyed per course. Nothing else is
stored and nothing leaves the device.

## Adding a language

Courses are plain data. Write a file next to the existing ones matching the
`Course` shape in [`src/types.ts`](src/types.ts), then add it to the array in
[`src/data/courses.ts`](src/data/courses.ts) — nothing else needs to change.

```
Course → Section[] → Module[] → Exercise[]
```

Three exercise types ship today:

| `type`            | Answered by                                  |
| ----------------- | -------------------------------------------- |
| `multiple-choice` | picking one of `options` (keys `1`–`4` work) |
| `fill-blank`      | typing the word for the `___` in `sentence`   |
| `matching`        | pairing tiles across two columns              |

Text answers are compared loosely — case, accents and surrounding punctuation
are ignored — which is what makes diacritics optional rather than a trap:
`adios` passes for `adiós`, `salve` for `salvē`, `ju` for `jū`. Use
`alternates` for spellings that differ in letters rather than marks, or for
genuinely different words that should also count.

Each course picks its own accents per section from `ACCENTS`, so languages stay
visually distinct: Spanish runs mint → azure → violet, Latin amber → rose →
violet, Japanese rose → azure → violet.

### Writing for a non-Latin script

The Japanese course shows the pattern. Words meant to be **read** carry script
and romaji together — `こんにちは (konnichiwa)` — so the learner meets the
writing system in multiple-choice and matching. Words meant to be **typed**,
which is every `fill-blank`, are romaji only, so no IME is needed.

### Adding a fourth exercise type

1. Add its interface to `Exercise` in `src/types.ts`.
2. Teach `grade()` in `src/lib/grade.ts` how to mark it.
3. Write the component in `src/components/exercises/`, taking `ExerciseProps`.
4. Add the case to `ExerciseView`.

The lesson player owns the answer state and the Check button, so a new exercise
type only has to render itself and report a draft answer. Exercises that finish
on their own — matching does — call `onAutoSubmit` instead of waiting for Check.

## Layout

```
src/
  types.ts                  content model + accent palette
  data/
    courses.ts              the course registry
    spanish.ts latin.ts japanese.ts
  lib/
    progress.ts             unlock rules and tallies (pure)
    grade.ts                answer checking (pure)
    shuffle.ts              seeded shuffle, stable per exercise
    accent.ts               publishes --accent to a subtree
    storage.ts              localStorage, guarded
  hooks/
    useProgress.ts          completed modules for one course
    useActiveCourse.ts      which language you are on
  components/
    CourseView.tsx          one course: progress + which screen shows
    Dashboard.tsx           path screen, sidebar on desktop
    CourseSidebar.tsx       progress, up-next, section jumps
    CoursePicker.tsx        language switcher
    SectionHeader.tsx       section card
    ModulePath.tsx          path geometry and connectors
    ModuleNode.tsx          one node: locked / available / completed
    LessonPlayer.tsx        exercise runner and summary
    exercises/              one component per exercise type
    ui/                     button, progress bar, icons
```

Sections publish their colour as a `--accent` CSS variable, so components use
`var(--accent)` rather than branching on colour. `CourseView` is keyed on the
course id, so switching language remounts progress state rather than
reconciling one course's progress onto another's.

## Notes

Responsive from 320px up: a single path column on phones with a docked
"up next" bar, widening to a sidebar layout at `lg`. Motion respects
`prefers-reduced-motion`.

There is no account, no backend, and no streaks or XP — just the path.
