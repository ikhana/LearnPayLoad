# TypeScript Lessons

A progressive track for learning TypeScript from scratch. Each lesson
builds on the previous one, uses plain non-Payload examples first, and
links to the Payload step where the concept first appears.

Read these front-to-back before starting the Payload steps, or use them
as reference when a step introduces a new TS concept.

---

| # | Lesson | Key concept | First used in |
|---|---|---|---|
| [00](00-what-is-typescript.md) | What is TypeScript? | Labels, compiler, `strict` | Step 00 |
| [01](01-type-annotations.md) | Type annotations | `: string`, `: number`, `: boolean` | Step 01.1 |
| [02](02-object-types.md) | Object types & interfaces | `type`, `interface`, nested objects | Step 01.2 |
| [03](03-literal-types.md) | Literal types & unions | `'draft' \| 'published'`, `\|` | Step 01.5 |
| [04](04-optional-and-null.md) | Optional properties & null | `?`, `\| null`, `??` | Step 01.3 |
| [05](05-arrays.md) | Arrays | `string[]`, `Array<string>` | Step 01.9 |
| [06](06-import-type.md) | `import type` | Type-only imports, compile-time erasure | Step 01.1 |
| [07](07-generics.md) | Generics | `Box<T>`, `Array<T>`, type parameters | Step 02.2 |
| [08](08-narrowing.md) | Union narrowing | `typeof`, type guards | Step 02.7 |
| [09](09-type-predicates.md) | Type predicates | `value is T`, `isPopulated<T>` | Step 02.8 |

---

## How to use these lessons

**If you're new to TypeScript:** Read lessons 00–06 before starting
Step 01. They'll take about an hour. You'll understand every annotation
and type error you encounter in the Payload steps.

**If you know some TypeScript:** Skim the lessons. Jump to whichever
one covers a concept you're fuzzy on. Each lesson is self-contained.

**During the Payload steps:** Each step doc links to the relevant TS
lesson. If the TS concept in a step confuses you, follow the link and
read the standalone lesson with plain examples first.
