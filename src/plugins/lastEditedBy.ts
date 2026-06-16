import type { Config, Plugin } from 'payload'

type LastEditedByPluginOptions = {
  collections?: string[]
}

export const lastEditedByPlugin =
  (options: LastEditedByPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    const targetCollections = options.collections || config.collections?.map((c) => c.slug) || []

    config.collections = (config.collections || []).map((collection) => {
      if (!targetCollections.includes(collection.slug)) {
        return collection
      }

      return {
        ...collection,
        fields: [
          ...collection.fields,
          {
            name: 'lastEditedBy',
            type: 'relationship' as const,
            relationTo: 'users',
            admin: {
              readOnly: true,
              position: 'sidebar' as const,
            },
          },
        ],
        hooks: {
          ...collection.hooks,
          beforeChange: [
            ...(collection.hooks?.beforeChange || []),
            async ({ data, req }) => {
              if (req.user) {
                data.lastEditedBy = req.user.id
              }
              return data
            },
          ],
        },
      }
    })

    return config
  }
