import { isAdmin } from '@/access/isAdmin'
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Settings',
  },

  access: {
    read: () => true,
    update: isAdmin,
  },

  fields: [
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2026 My Site. All rights reserved',
      admin: {
        description: 'The Copy right line shown at the bottom of every page ',
      },
    },

    {
      name: 'sociallinks',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Youtube', value: 'youtube' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Pinterest', value: 'piterest' },
            { label: 'Github', value: 'github' },
          ],
        },
      ],
    },

    {
      name: 'url',
      type: 'text',
      required: true,
    },
  ],
}
