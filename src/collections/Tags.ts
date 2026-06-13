import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
    description:
      'Granular keyword tags. Posts can have many tags — used for topic analysis in the SEO plugin',
  },
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
  timestamps: true,
}
