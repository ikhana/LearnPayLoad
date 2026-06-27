import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { draftMode } from 'next/headers'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params }: Args) {
  const { slug = 'home' } = await params
  const payload = await getPayload({ config })

  const { isEnabled: isDraftMode } = await draftMode()

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
    },
    overrideAccess: true,
    draft: isDraftMode,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return notFound()

  return (
    <main>
      <RefreshRouteOnSave />
      <h1>{page.title}</h1>
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
