import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isAuthenticated } from '@/access/isAuthenticated'
import { isAuthenticatedOrPublished } from '@/access/isAuthenticatedOrPublished'
import type { CollectionConfig } from 'payload'
import { slugify } from '@/hooks/slugify'
import { autoPublishedDate } from '@/hooks/autoPublishDate'
import { logChanges } from '@/hooks/logChanges'
import { searchPosts } from '@/endpoints/searchPosts'
import { siteStats } from '@/endpoints/siteStats'
import { bulkPublish } from '@/endpoints/bulkPublish'
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    group: 'Content',
    description:
      'Blog posts and articles — the canonical content type our AI SEO plugin will analyze.',
  },

  versions: {
    drafts: { autosave: { interval: 10000 } },
    maxPerDoc: 25,
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
    beforeChange: [slugify, autoPublishedDate],
    afterChange: [logChanges],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', components: { Field: '/components/SlugField#SlugField' } },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short summary used on listing pages and as a fallback meta description.',
      },
    },
    {
      name: 'excerptCharCount',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/ExcerptCharCount#ExcerptCharCount',
        },
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
  endpoints: [searchPosts, siteStats, bulkPublish],
}
