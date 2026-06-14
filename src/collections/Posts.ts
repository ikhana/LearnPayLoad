import type { CollectionConfig } from 'payload'
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    group: 'Content',
    description:
      'Blog posts and articles — the canonical content type our AI SEO plugin will analyze.',
  },
  access: {
    // Anyone can read published posts, logged-in users see all
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },

    // Only logged-in users can create
    create: ({ req: { user } }) => Boolean(user),

    // Only admins and editors can update
    update: ({ req: { user } }) => {
      if (!user) return false
      return Boolean((user.roles as string[])?.some((role) => ['admin', 'editor'].includes(role)))
    },

    // Only admins can delete
    delete: ({ req: { user } }) => {
      if (!user) return false
      return Boolean((user.roles as string[])?.includes('admin'))
    },
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
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary used on listing pages and as a fallback meta description.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
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
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,

      admin: {
        position: 'sidebar',
      },
    },
  ],
}
