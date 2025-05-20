import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Available',
          value: 'available',
        },
        {
          label: 'Solt Out',
          value: ' sold_out',
        },
      ],

      defaultValue: 'draft',
      required: true,
    },
  ],
}
