// collections/Manufacturers.ts
import type { CollectionConfig } from 'payload'

export const Manufacturers: CollectionConfig = {
  slug: 'manufacturers', // can be 'manufacturer' if you prefer
  admin: { useAsTitle: 'title' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media', // must match your media collection slug
    },
    {
      name: 'cars',
      type: 'relationship',
      relationTo: 'cars',  // <-- target collection slug
      hasMany: true,       // <-- multiple cars per manufacturer
    },
  ],
}
