import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },

    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: ['images/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        height: 400,
        width: 300,
        position: 'centre',
      },
      {
        name: 'card',
        height: 768,
        width: 1024,
      },
      {
        name: 'og',
        height: 1200,
        width: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'adminthumbnail',
    focalPoint: true,
    crop: true,
  },
}
