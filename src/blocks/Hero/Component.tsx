import type { HeroBlock as HeroBlockType } from '@/payload-types'

export const HeroBlock = ({ heading, subheading, ctaText, ctaLink }: HeroBlockType) => {
  return (
    <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h2>{heading}</h2>
      {subheading && <p>{subheading}</p>}
      {ctaText && <a href={ctaLink || '#'}>{ctaText}</a>}
    </section>
  )
}
