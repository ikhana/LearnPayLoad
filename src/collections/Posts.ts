import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isAuthenticated } from '@/access/isAuthenticated'
import { isAuthenticatedOrPublished } from '@/access/isAuthenticatedOrPublished'
import type { CollectionConfig } from 'payload'
import { slugify } from '@/hooks/slugify'
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
    read: isAuthenticatedOrPublished,

    // Only logged-in users can create
    create: isAuthenticated,

    // Only admins and editors can update
    update: isAdminOrEditor,

    // Only admins can delete
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [slugify],
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
