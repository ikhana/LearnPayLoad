import { CollectionBeforeChangeHook } from 'payload'

export const autoPublishedDate: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  if (data.status === 'published') {
    if (operation === 'create' || originalDoc.status !== 'published') {
      data.publishedAt = new Date().toISOString()
    }
  }

  return data
}
