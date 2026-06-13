import type { CollectionConfig } from 'payload'
import { text } from 'stream/consumers'

export const Tags: CollectionConfig = {
  slug: 'tags',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      index: true,
      required: true,
    },

    {
      name: 'description',
      type: 'richText',
    },
  ],
}
