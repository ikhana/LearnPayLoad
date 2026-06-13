import type { GlobalConfig } from 'payload'
import { upload } from 'payload/shared'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',

  fields: [
    {
      name: 'sitename',
      label: 'Site Name',
      type: 'text',
      required: true,
      defaultValue: 'My Payload Site',
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'A short tagline for the site — used in the title bar and meta tags',
      },
    },

    {
      name: 'seo',
      label: 'Deafult SEO',
      type: 'group',
      admin: {
        description: 'Fallback SEO values when a page or post does not have its own.',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Default meta title. The site name is appended automatically.',
          },
        },

        {
          name: 'metaDescription',
          label: 'Meta Description',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'Default meta description (max 160 characters).',
          },
        },

        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Default social share image when a page has no featured image.',
          },
        },
      ],
    },
  ],
}
