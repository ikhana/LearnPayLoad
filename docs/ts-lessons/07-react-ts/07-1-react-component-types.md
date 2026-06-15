# Lesson 07.1 — React + TypeScript basics

How to type React components, props, and event handlers in TypeScript.

---

## The problem

You're writing a React component. TypeScript needs to know:

- What props does this component accept?
- What does `onChange` give you?
- What type is `children`?

Without types, you get `any` everywhere and lose autocomplete.

---

## Typing a component with props

```tsx
// Method 1: Inline props type
const Greeting = ({ name }: { name: string }) => {
  return <h1>Hello, {name}</h1>
}

// Method 2: Separate props type (better for complex props)
type GreetingProps = {
  name: string
  age?: number  // optional
}

const Greeting = ({ name, age }: GreetingProps) => {
  return (
    <div>
      <h1>Hello, {name}</h1>
      {age && <p>Age: {age}</p>}
    </div>
  )
}
```

**Use Method 2** when you have more than 2 props. It's clearer and
reusable.

---

## `FC` — FunctionComponent

React provides a built-in type:

```tsx
import type { FC } from 'react'

type GreetingProps = {
  name: string
}

const Greeting: FC<GreetingProps> = ({ name }) => {
  return <h1>Hello, {name}</h1>
}
```

`FC<Props>` is a generic — it says "this is a function component that
accepts `Props`." It auto-types `children` and the return type.

**When to use `FC`:** It's a style choice. Many teams skip it and just
type the props directly. Both work fine. Payload's own codebase uses
both patterns.

---

## Event handlers

```tsx
const Form = () => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log('clicked')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  return (
    <form>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  )
}
```

**Common event types:**

| Event | Type |
|---|---|
| `onClick` | `React.MouseEvent<HTMLButtonElement>` |
| `onChange` (input) | `React.ChangeEvent<HTMLInputElement>` |
| `onChange` (textarea) | `React.ChangeEvent<HTMLTextAreaElement>` |
| `onSubmit` | `React.FormEvent<HTMLFormElement>` |

**Shortcut:** If you can't remember the type, hover over the handler
in VS Code — it shows the expected type.

---

## `'use client'` directive

In Next.js (and Payload), components are **server components** by
default. They run on the server and can't use:

- `useState`, `useEffect`, or any React hook
- Browser APIs (`window`, `document`)
- Event handlers (`onClick`, `onChange`)

Adding `'use client'` at the top of the file makes it a **client
component** — it runs in the browser.

```tsx
'use client'  // ← Must be the very first line

import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Rule:** All Payload admin components must be `'use client'` because
they use Payload's UI hooks (`useField`, `useWatchForm`, etc.).

---

## Payload-specific component types

Payload exports typed component interfaces:

```tsx
import type { TextFieldClientComponent } from 'payload'

// This type tells TS: "this component receives text field props"
export const MyTextField: TextFieldClientComponent = ({ field }) => {
  // field.label, field.required, etc. — all typed
  return <div>{field.label}</div>
}
```

Common Payload component types:

| Type | Used for |
|---|---|
| `TextFieldClientComponent` | Replacing a text field's UI |
| `SelectFieldClientComponent` | Replacing a select field's UI |
| `UIFieldClientComponent` | A `ui` field component |

---

## Payload UI hooks

These hooks come from `@payloadcms/ui`:

```tsx
import { useField, useWatchForm, useTableCell } from '@payloadcms/ui'

// useField — read/write the current field's value
const { value, setValue } = useField<string>({ path: 'slug' })

// useWatchForm — read any field in the form
const { getDataByPath } = useWatchForm()
const title = getDataByPath<string>('title')

// Cell components receive props directly (no hook needed)
// import type { DefaultCellComponentProps } from 'payload'
// const StatusCell = ({ cellData }: DefaultCellComponentProps) => ...
```

---

## Try it yourself

Create a React component with TypeScript that:

1. Accepts props: `label` (string, required) and `maxLength` (number, optional, default 100)
2. Shows a text input with the label above it
3. Shows a character count below: "X / 100 characters"
4. The count turns red when over maxLength

```tsx
// Your code here — just the component, not a full file
type CharInputProps = {
  label: string
  maxLength?: number
}

const CharInput = ({ label, maxLength = 100 }: CharInputProps) => {
  // Use useState for the input value
  // Show the count with conditional color
  // ???
}
```

**Bonus:** Type the `onChange` handler explicitly instead of letting TS
infer it.

---

| Nav | |
|---|---|
| ← Previous | [06.4 — async/await](../06-narrowing/06-4-async-await.md) |
| → Next | _(08.1 — coming)_ |
