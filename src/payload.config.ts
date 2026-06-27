import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { lastEditedByPlugin } from './plugins/lastEditedBy'

import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'
import { Pages } from './collections/Pages'
import type { Page, Post } from './payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const generateTitle: GenerateTitle<Page | Post> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Leanr PayLoad` : 'Learn Payload'
}

const generateURL: GenerateURL<Page | Post> = ({ doc }) => {
  return doc?.slug
    ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/${doc.slug}`
    : ''
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ data, locale }) => {
        const baseURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
        const slug = data?.slug

        const pagePath = !slug || slug === 'home' ? '/' : `/${slug}`
        const localeParam = locale?.code ? `&locale=${locale.code}` : ''

        return `${baseURL}/preview?path=${encodeURIComponent(pagePath)}${localeParam}`
      },
      collections: ['pages'],
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },

  collections: [Users, Media, Posts, Categories, Tags, Pages],
  globals: [Header, Footer, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    seoPlugin({ collections: [Posts, Pages], generateTitle, generateURL }),
    lastEditedByPlugin({ collections: ['posts', 'pages'] }),
  ],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'German',
        code: 'de',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
})
