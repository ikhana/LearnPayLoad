import type { ContentBlock as ContentBlockType } from '@/payload-types'

export const ContentBlock = ({ text, imageAlignment }: ContentBlockType) => {
  return (
    <section style={{ padding: '2rem' }}>
      <div>Rich text content here</div>
      {imageAlignment && <small>Image aligned: {imageAlignment}</small>}
    </section>
  )
}
