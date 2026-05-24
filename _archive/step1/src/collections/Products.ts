import { CollectionConfig } from 'payload'
import { upload } from 'payload/shared'

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
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The main image for this product',
      },
    },

    {
      name: 'images',
      type: 'array',
      label: 'additional images',
      admin: {
        description: 'Additional product images (optional)',
      },

      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'addotional images for product (optional)',
          },
        },
      ],
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
