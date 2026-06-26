import type { CollectionConfig } from 'payload'
import { config as Hero } from '@/blocks/Hero'
import { config as Content } from '@/blocks/Content'
import { config as CallToAction } from '@/blocks/CallToAction'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
    maxPerDoc: 25,
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
      name: 'layout',
      type: 'blocks',
      blocks: [Hero, Content, CallToAction],
    },
  ],
}
