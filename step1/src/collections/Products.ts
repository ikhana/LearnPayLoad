import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'email',
  },

  fields: [
    {
      name: 'email',
      type: 'text',
    },
  ],
}
