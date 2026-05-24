import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },

  access: {
    read: () => true,
  },

  upload: {
    staticDir: 'media',

    mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },

      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
      admin: {
        description: 'Describe the image for screen readers and SEO',
      },
    },

    {
      name: 'caption',
      type: 'text',
      label: 'Caption',

      admin: {
        description: 'option description to display with image',
      },
    },
  ],
}
