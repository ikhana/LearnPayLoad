# TypeScript Lessons — Master Plan

A progressive track for learning TypeScript from scratch. Organized into
**topics**, each with **sub-steps**. Each sub-step is one small lesson
with plain non-Payload examples first, then a Payload connection.

> **Rule**: a sub-step is only marked `[x]` when you've read the lesson
> file AND done the "Try it yourself" exercise at the bottom. No
> skipping — the exercises build muscle memory.

Status legend: `[ ]` not done · `[x]` done

---

## Topic 01 — Foundations

_What TypeScript is and how to label things. Start here._

| # | Lesson | What you learn | Status | Payload step |
|---|---|---|---|---|
| [01.1](01-foundations/01-1-what-is-typescript.md) | What is TypeScript? | Labels, compiler, `strict`, `tsconfig.json` | `[x]` | Step 00 |
| [01.2](01-foundations/01-2-type-annotations.md) | Type annotations | `: string`, `: number`, `: boolean` on variables & params | `[x]` | Step 01.1 |
| [01.3](01-foundations/01-3-booleans-and-primitives.md) | Booleans & primitives | `boolean`, `true`/`false`, `'true'` ≠ `true` | `[x]` | Step 01.3 |

---

## Topic 02 — Object Shapes

_How to describe the shape of an object — which properties it has and
what types they hold._

| # | Lesson | What you learn | Status | Payload step |
|---|---|---|---|---|
| [02.1](02-object-shapes/02-1-object-types.md) | Object types & `type` aliases | `type Person = { name: string }` | `[x]` | Step 01.2 |
| [02.2](02-object-shapes/02-2-interfaces.md) | Interfaces | `interface` vs `type`, when to use which | `[x]` | Step 01.10 |
| [02.3](02-object-shapes/02-3-nested-objects.md) | Nested objects | Objects inside objects, autocomplete at depth | `[x]` | Step 01.4 |
| [02.4](02-object-shapes/02-4-optional-and-null.md) | Optional properties & null | `?`, `| null`, `??` operator | `[x]` | Step 01.3 |

---

## Topic 03 — Restricting Values

_How TypeScript can narrow a value from "any string" to "only these
specific strings."_

| # | Lesson | What you learn | Status | Payload step |
|---|---|---|---|---|
| [03.1](03-restricting-values/03-1-literal-types.md) | Literal types | `'red'` as a type, not just a value | `[x]` | Step 01.2 |
| [03.2](03-restricting-values/03-2-union-types.md) | Union types | `'draft' \| 'published'`, the `\|` operator | `[x]` | Step 01.5 |
| [03.3](03-restricting-values/03-3-unions-of-shapes.md) | Unions of different shapes | `string \| { label: string; value: string }` | `[x]` | Step 01.8 |
| [03.4](03-restricting-values/03-4-as-const.md) | `as const` | `as const`, `readonly`, `typeof ARRAY[number]` | `[ ]` | Step 03.4 |

---

## Topic 04 — Lists & Imports

_Arrays, typed lists, and how TypeScript imports work._

| # | Lesson | What you learn | Status | Payload step |
|---|---|---|---|---|
| [04.1](04-lists-and-imports/04-1-arrays.md) | Arrays | `string[]`, arrays of objects, element enforcement | `[x]` | Step 01.9 |
| [04.2](04-lists-and-imports/04-2-import-type.md) | `import type` | Type-only imports, compile-time erasure, `import` vs `import type` | `[x]` | Step 01.1 |
| [04.3](04-lists-and-imports/04-3-discriminated-unions.md) | Discriminated unions | `type` as discriminant, narrowing object unions | `[ ]` | Step 04.2 |

---

## Topic 05 — Generics

_Types that take a parameter — the most important TS concept in this
project._

| # | Lesson | What you learn | Status | Payload step |
|---|---|---|---|---|
| [05.1](05-generics/05-1-what-are-generics.md) | What are generics? | `Box<T>`, type parameters, the `< >` slot | `[x]` | Step 02.2 |
| [05.2](05-generics/05-2-array-is-a-generic.md) | `Array<T>` — a generic you know | `Array<string>` ≡ `string[]`, multiple type params | `[x]` | Step 02.2 |
| [05.3](05-generics/05-3-generics-in-payload.md) | Generics in Payload | `RelationshipField`, `(number \| Category)[]` | `[x]` | Step 02.5 |
| [05.4](05-generics/05-4-function-types.md) | Function types | Function shape as a type, callbacks, Payload's `Access` type | `[ ]` | Step 05.1 |

---

## Topic 06 — Narrowing & Type Guards

_How to tell TypeScript which branch of a union you're in._

| # | Lesson | What you learn | Status | Payload step |
|---|---|---|---|---|
| [06.1](06-narrowing/06-1-the-narrowing-problem.md) | The narrowing problem | Why `value.length` fails on `string \| number` | `[x]` | Step 02.7 |
| [06.2](06-narrowing/06-2-typeof-guards.md) | `typeof` type guards | `typeof x === 'string'`, narrowing inside `if` blocks | `[x]` | Step 02.7 |
| [06.3](06-narrowing/06-3-type-predicates.md) | Type predicates | `value is T`, custom guard functions, `isPopulated<T>` | `[x]` | Step 02.8 |
| [06.4](06-narrowing/06-4-async-await.md) | `async`/`await` | `Promise<T>`, `await`, error handling in async functions | `[ ]` | Step 06.1 |

---

## How to use these lessons

**If you're new to TypeScript:** Work through Topics 01–04 before
starting Payload Step 01. That's ~1 hour. You'll understand every
annotation and type error in the Payload steps.

**If you know some TypeScript:** Skim, jump to the topic that's fuzzy.
Each sub-step is self-contained.

**During the Payload steps:** Each step doc links to the relevant TS
lesson. If confused, follow the link — read the plain examples first,
then come back to the Payload code.

**Progress:** Mark each sub-step `[x]` only after you've read it AND
done the "Try it yourself" section. When all sub-steps in a topic are
`[x]`, that topic is done.
