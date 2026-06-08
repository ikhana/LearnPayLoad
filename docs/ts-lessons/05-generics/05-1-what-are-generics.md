# TS 05.1 — What are generics?

> **Topic 05: Generics** · Next: [05.2](05-2-array-is-a-generic.md)

---

## The one-sentence version

A **generic type** is a type with a fill-in-the-blank slot. You write
it once, fill in the blank each time you use it.

---

## The labeled box

A shipping box can hold anything. But once you label it "Books,"
everyone knows what's inside:

```ts
type Box<T> = {
  label: string
  contents: T
}
```

`<T>` is the blank. Fill it in when you use the type:

```ts
const shoeBox: Box<string> = {
  label: 'Running shoes',
  contents: 'Nike Air Max',     // T = string → must be string
}

const ageBox: Box<number> = {
  label: 'My age',
  contents: 30,                  // T = number → must be number
}

const broken: Box<number> = {
  label: 'Oops',
  contents: 'thirty',           // ← squiggle: string ≠ number
}
```

---

## Reading the `<T>`

Think of it like a function, but for types:

```ts
// Function takes a VALUE parameter:
function double(x: number) { return x * 2 }
double(5)         // fill in x = 5

// Generic takes a TYPE parameter:
type Box<T> = { contents: T }
Box<string>       // fill in T = string
```

`T` is a convention. You can use any name (`<Item>`, `<Value>`), but
single uppercase letters (`T`, `U`, `K`, `V`) are the tradition.

---

## Exercise

> **Create file:** `exercises/05-1-generics-intro.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 05.1 — What are generics?

// 1. Define a Wrapper generic
type Wrapper<T> = {
  value: T
  timestamp: number
}

const w1: Wrapper<string> = { value: 'hello', timestamp: Date.now() }
const w2: Wrapper<boolean> = { value: true, timestamp: Date.now() }
const w3: Wrapper<boolean> = { value: 'yes', timestamp: Date.now() }
// ← squiggle on w3 — fix it

// 2. What does Box<string[]> mean?
type Box<T> = { contents: T }
const b: Box<string[]> = { contents: ['a', 'b', 'c'] }

// 3. Try Box<number> with a string contents — see the squiggle
const broken: Box<number> = { contents: 'thirty' }

// 4. Define your own generic: Response<T> with { data: T; ok: boolean }
```

Save. See squiggles on w3 and broken. Fix them. When the file is
clean, this lesson is done.
