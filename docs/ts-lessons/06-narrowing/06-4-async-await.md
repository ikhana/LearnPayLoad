# TS 06.4 — `async`/`await` and `Promise<T>`

> **Topic 06: Narrowing & Type Guards** · Prev: [06.3](06-3-type-predicates.md)

---

## The one-sentence version

`async` functions always return a `Promise<T>`, and `await` unwraps the
promise to get the actual value.

---

## The problem: slow things take time

Some operations aren't instant — reading a database, calling an API,
writing a file. JavaScript handles these with **promises**: an object
that says "I'll give you the result later."

```ts
// Without async/await — callback hell
fetch('/api/posts')
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
```

---

## The fix: `async`/`await`

```ts
async function getPosts() {
  const response = await fetch('/api/posts')
  const data = await response.json()
  console.log(data)
}
```

- `async` before the function — marks it as asynchronous
- `await` before the call — pauses until the promise resolves
- The code reads top-to-bottom, like synchronous code

---

## What `Promise<T>` means in types

```ts
async function getTitle(): Promise<string> {
  const response = await fetch('/api/posts/1')
  const post = await response.json()
  return post.title  // This is a string
}

// The return type is Promise<string>
// Because async functions always wrap the return in a Promise
```

When you see `Promise<string>`, it means: "this function eventually
gives you a string, but not right now — you need to `await` it."

---

## `async` always returns a Promise

Even if you return a plain value:

```ts
async function five(): Promise<number> {
  return 5
}

// five() returns Promise<number>, not number
// You must await it:
const result = await five()  // result is number
```

---

## Error handling with try/catch

```ts
async function safeFetch() {
  try {
    const response = await fetch('/api/posts')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch:', error)
    return null
  }
}
```

If the `await` fails (network error, server error), execution jumps to
`catch`. Same pattern as synchronous try/catch.

---

## Payload connection

Every Payload hook is an async function:

```ts
import type { CollectionBeforeChangeHook } from 'payload'

export const myHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // You can await things:
  const count = await req.payload.count({
    collection: 'posts',
  })

  data.totalPosts = count

  return data  // Still must return data!
}
```

Payload's Local API methods (`find`, `findByID`, `create`, `update`,
`delete`, `count`) are all async — they return promises. You must
`await` them inside hooks.

```ts
// ❌ Forgot await — gets a Promise object, not the actual posts
const posts = req.payload.find({ collection: 'posts' })

// ✅ Awaited — gets the actual result
const posts = await req.payload.find({ collection: 'posts' })
```

---

## Exercise

> **Create file:** `exercises/06-4-async-await.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 06.4 — async/await

// 1. A simple async function
async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`
}

// 2. Hover over the return type — it's Promise<string>
const greeting = greet('Inaam')
// greeting is Promise<string>, NOT string

// 3. To get the actual string, you'd need await:
// const actual = await greet('Inaam')
// But await only works inside async functions!

// 4. Simulate a database call
async function findPost(id: number): Promise<{ title: string } | null> {
  if (id === 1) return { title: 'First Post' }
  return null
}

// 5. Chain async calls
async function getPostTitle(id: number): Promise<string> {
  const post = await findPost(id)
  if (!post) return 'Not found'
  return post.title
}

// 6. This should squiggle — forgot await:
async function broken(id: number): Promise<string> {
  const post = findPost(id)  // Missing await!
  return post.title           // ❌ post is Promise, not the object
}

// 7. Error handling:
async function safeFetch(id: number): Promise<string> {
  try {
    const post = await findPost(id)
    if (!post) throw new Error('Not found')
    return post.title
  } catch (error) {
    return 'Error occurred'
  }
}
```

Save. Fix the `broken` function by adding `await`. Hover over each
variable to see the Promise types. This lesson is done when you can
explain why `await` is needed and what happens if you forget it.
