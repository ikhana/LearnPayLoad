import { CollectionBeforeChangeHook } from 'payload'

export const autoPublishedDate: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  if (data._status === 'published') {
    if (operation === 'create' || originalDoc?._status !== 'published') {
      data.publishedAt = new Date().toISOString()
    }
  }

  return data
}
