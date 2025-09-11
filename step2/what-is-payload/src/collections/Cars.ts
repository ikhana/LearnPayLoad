// collections/Cars.ts
import type { CollectionConfig } from 'payload'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: { useAsTitle: 'model' },
  fields: [
    { name: 'model', type: 'text', required: true },
    {name:'image',type:'upload',relationTo:'media'},
    { name: 'manufacturer', type: 'relationship', relationTo: 'manufacturers' },
  ],
}
