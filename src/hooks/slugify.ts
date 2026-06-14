import { CollectionBeforeChangeHook } from 'payload'

export const slugify: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' && data.title) {
    data.slug = (data.title as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
  return data
}
