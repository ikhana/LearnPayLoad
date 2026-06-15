export const bulkPublish = {
  path: '/bulk-publish',
  method: 'post' as const,
  handler: async (req: any) => {
    if (!req.user) {
      return Response.json({ error: 'You must be logged in' }, { status: 401 })
    }

    const roles = (req.user.roles as string[]) || []
    if (!roles.includes('admin') && !roles.includes('editor')) {
      return Response.json({ error: 'Only admins and editors can bulk publish' }, { status: 403 })
    }

    const body = await req.json()
    const ids: string[] = body?.ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return Response.json(
        { error: 'Provide an array of post IDs in { "ids": [...] }' },
        { status: 400 },
      )
    }

    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const doc = await req.payload.update({
            collection: 'posts',
            id,
            data: { status: 'published' },
            req,
          })
          return { id, success: true, title: doc.title }
        } catch (error) {
          return { id, success: false, error: String(error) }
        }
      }),
    )

    const published = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    return Response.json({
      published: published.length,
      failed: failed.length,
      results,
    })
  },
}
