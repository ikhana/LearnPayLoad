// Exercise 05.3 — Generics in Payload

// Read these generated types and answer the questions:

type Category = { id: number; title: string }
type Tag = { id: number; title: string }
type Media = { id: number; url: string }

interface Post {
  id: number
  title: string
  category: number | Category // Q1: What is this at depth 0?
  tags?: (number | Tag)[] | null // Q2: What is this at depth 0?
  featuredImage?: number | Media // Q3: What is this at depth 2?
}

// Write your answers as comments:
// A1: This will be a number at depth 0
// A2: This will also be a number[] a depth 0
// A3: this will be hoever media boject at depth 2
