# Lumen

A minimalist language-learning app: sections of modules laid out on a
progression path, worked through one exercise at a time, with flashcards for
review. Ships with three courses — **Spanish**, **Latin** and **Japanese** — of
13 modules each, every module a two-part lesson of 10 exercises.

Dark, high-contrast, and deliberately quiet — depth comes from hairlines and
soft shadows rather than dividers, and colour is saved for progress and for the
streak fire.

```bash
npm install && npm run dev
```

## Learn

- **Path** — sections stacked vertically, each drawn as a meandering path of
  module nodes. A node is locked, available, or completed, and the connector
  behind it lights up as you advance. Modules unlock strictly in sequence,
  across section boundaries too.
- **Lessons in parts** — each module is one sitting split into **Words** then
  **Sentences**, with a break between that recaps the words just learned.
- **Nothing left wrong** — a missed exercise goes to the back of its part and
  keeps coming back, reshuffled, until it's answered correctly. A part can't
  end with a miss outstanding, so finishing a module means every answer in it
  was eventually right.
- **Streak fire** — three correct answers in a row sets the progress bar
  alight; it burns hotter at five and again at eight, and a miss puts it out.
  The summary shows first-try accuracy, misses fixed, and your best streak.

## Cards

- **Review decks** — built from the course itself: every matching pair becomes
  a word card and every filled-in sentence a sentence card. Study everything
  you've learned, or one module at a time.
- **Study sessions** — tap or press Space to flip, then mark each card *Know
  it* or *Still learning* by button, arrow key, or swipe. Cards you're still
  learning come back in another round until the deck is clear.
- **Your sets** — make a set from course words (searchable) or your own cards.
- **Sharing** — a set is compressed into a link like `…/#set=L1…`. Opening it
  shows a preview and asks before adding anything. There is no server: the
  whole set travels inside the link's `#fragment`, which browsers never send
  anywhere. A bare code works too, for pasting into **Import**.

  Links only open where Lumen is hosted — while you run it on `localhost`, send
  the code instead. Deploy the app (any static host) and links work for anyone.

Progress, the active language, and sets live in `localStorage`. There is no
account and nothing leaves the device except what you choose to share.

## Adding a language

Write a file next to the existing ones and add it to
[`src/data/courses.ts`](src/data/courses.ts). Course files use small authoring
helpers from [`src/data/build.ts`](src/data/build.ts):

```ts
defineModule('s1-m1', 'Greetings', 'Say hello and goodbye', [
  part('Words', [
    choose('Choose the translation', 'Hola', 'Hello', ['Goodbye', 'Please']),
    match([
      ['hola', 'hello'],
      ['adiós', 'goodbye'],
      ['gracias', 'thank you'],
    ]),
  ]),
  part('Sentences', [
    fill('___, me llamo Ana.', 'Hola', 'Hello, my name is Ana.'),
  ]),
])
```

- `choose` takes the right answer apart from the distractors; options are
  shuffled when shown, so their order carries no hint.
- `fill` marks the gap with `___`. Answers ignore case, accents and
  punctuation — `adios` passes for `adiós`, `salve` for `salvē` — and
  `alternates` covers genuinely different spellings.
- `defineModule` derives every id from position and its type requires **at
  least two parts**.

The helpers only save typing: they return plain data in the shapes from
[`src/types.ts`](src/types.ts), so a course loaded as JSON needs none of them.

For a non-Latin script, follow the Japanese course: words meant to be read carry
script and romaji together (`こんにちは (konnichiwa)`), and everything typed is
romaji, so no IME is needed.

### Adding an exercise type

1. Add its interface to `Exercise` in `src/types.ts`.
2. Teach `grade()` in `src/lib/grade.ts` how to mark it.
3. Write the component in `src/components/exercises/`, taking `ExerciseProps`.
4. Add the case to `ExerciseView`.

The lesson engine owns answer state, grading, retries and the streak, so a new
type only renders itself and reports a draft. Use the `seed` prop for any
shuffling, so a retry lays out differently.

## Layout

```
src/
  types.ts                  content model + accent palette
  data/
    build.ts                course authoring helpers
    courses.ts              the course registry
    spanish.ts latin.ts japanese.ts
  lib/                      pure logic, no React
    lesson.ts               lesson engine: queue, retries, parts, streak
    progress.ts             unlock rules and tallies
    grade.ts                answer checking
    vocab.ts                flashcard decks from course content
    sets.ts                 set shape, validation and limits
    share.ts                set ⇄ link codec (deflate + base64url)
    storage.ts              localStorage, guarded
    shuffle.ts accent.ts
  hooks/                    useProgress · useCardSets · useActiveCourse
  components/
    CourseView.tsx          one course: state + which view shows
    HomeScreen.tsx          the Learn and Cards tabs in the shell
    CoursePicker.tsx        language switcher
    shell/                  sidebar, mobile header, tab bar
    learn/                  path, nodes, section cards, sidebar, up-next dock
    lesson/                 player, streak bar, part break, summary
    exercises/              one component per exercise type
    cards/                  decks, study session, set editor, share, import
    ui/                     button, sheet, progress bar, icons
```

`CourseView` is keyed on the course id, so switching language remounts progress
and sets rather than reconciling one course's state onto another's. Anything
arriving from a share link — or from storage — passes through the same
validation and size caps before the app uses it.

## Notes

Responsive from 320px up: a single column on phones with a bottom tab bar,
widening to a sidebar layout at `lg`. Motion, including the streak fire, respects
`prefers-reduced-motion`.
