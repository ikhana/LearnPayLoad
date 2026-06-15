'use client'

import { TextInput, FieldLabel, useField, useWatchForm } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { formatSlug } from '@/utilities/formatSlug'

export const SlugField: TextFieldClientComponent = ({ field }) => {
  const { value, setValue } = useField<string>({ path: 'slug' })
  const { getDataByPath } = useWatchForm()

  const handleGenerate = () => {
    const title = getDataByPath<string>('title') || ''
    if (title) {
      setValue(formatSlug(title))
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <FieldLabel label={field.label || 'Slug'} />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <TextInput
            path="slug"
            value={value || ''}
            onChange={(e: any) => setValue(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          style={{
            padding: '10px 16px',
            cursor: 'pointer',
            backgroundColor: 'var(--theme-elevation-150)',
            border: '1px solid var(--theme-elevation-250)',
            borderRadius: '4px',
            color: 'var(--theme-text)',
            whiteSpace: 'nowrap',
          }}
        >
          Generate
        </button>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginTop: '4px' }}>
        Auto-generated from title. Edit manually if needed.
      </p>
    </div>
  )
}
