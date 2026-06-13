import type { CollectionConfig } from 'payload'

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
      type: 'textarea',
    },
  ],
}
