import type { CollectionAfterChangeHook } from 'payload'

export const logChanges: CollectionAfterChangeHook = ({ doc, operation, req, context }) => {
  if (context.skipLog) return doc

  req.payload.logger.info(`[Posts] ${operation}: "${doc.title}" (id: ${doc.id})`)

  return doc
}
