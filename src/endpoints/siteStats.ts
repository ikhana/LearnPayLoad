export const siteStats = {
  path: '/stats',
  method: 'get' as const,
  handler: async (req: any) => {
    if (!req.user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [posts, categories, tags] = await Promise.all([
      req.payload.count({ collection: 'posts' }),
      req.payload.count({ collection: 'categories' }),
      req.payload.count({ collection: 'tags' }),
    ])

    const publishedToday = await req.payload.count({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { publishedAt: { greater_than_equal: today.toISOString() } },
        ],
      },
    })

    return Response.json({
      totalPosts: posts.totalDocs,
      totalCategories: categories.totalDocs,
      totalTags: tags.totalDocs,
      publishedToday: publishedToday.totalDocs,
      generatedAt: new Date().toISOString(),
    })
  },
}
