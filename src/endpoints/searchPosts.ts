export const searchPosts = {
  path: '/search',
  method: 'get' as const,
  handler: async (req: any) => {
    const url = new URL(req.url)
    const query = url.searchParams.get('q') || ''
    const limit = parseInt(url.searchParams.get('limit') || '10')

    if (!query) {
      return Response.json({ error: 'Missing "q" query parameter' }, { status: 400 })
    }

    const results = await req.payload.find({
      collection: 'posts',
      where: {
        or: [{ title: { contains: query } }, { excerpt: { contains: query } }],
      },
      limit,
      sort: '-createdAt',
    })

    return Response.json({
      query,
      total: results.totalDocs,
      posts: results.docs.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
      })),
    })
  },
}
