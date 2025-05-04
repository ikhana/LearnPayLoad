import type { CollectionConfig } from 'payload'

export const NewProduct: CollectionConfig = {
  slug: 'newproducts',
  admin: {
    useAsTitle: 'name',
  },

  fields: [
    {
      name: 'name',
      type: 'textarea',
    },
  ],
}
