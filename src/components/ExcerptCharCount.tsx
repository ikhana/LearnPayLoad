'use client'

import { useWatchForm } from '@payloadcms/ui'

export const ExcerptCharCount = () => {
  const { getDataByPath } = useWatchForm()

  const excerpt = getDataByPath<string>('excerpt') || ''
  const count = excerpt.length
  const limit = 155

  const color = count > limit ? 'red' : count > 120 ? 'orange' : 'green'

  return (
    <div style={{ fontSize: '13px', color, padding: '4px 0' }}>
      {count} / {limit} characters
      {count > limit && ' — too long for meta descriptions'}
    </div>
  )
}
