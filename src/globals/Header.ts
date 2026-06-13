import type { GlobalConfig } from 'payload'
import { tr } from 'payload/i18n/tr'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'nav',
      type: 'array',
      label: 'Navigation Links',
      maxRows: 10,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
