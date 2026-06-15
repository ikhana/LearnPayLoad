import type { CallToActionBlock as CTABlockType } from '@/payload-types'

export const CallToActionBlock = ({ heading, description, buttons }: CTABlockType) => {
  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>{heading}</h3>
      {description && <p>{description}</p>}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {buttons?.map((btn, i) => (
          <a key={i} href={btn.link}>
            {btn.label}
          </a>
        ))}
      </div>
    </section>
  )
}
