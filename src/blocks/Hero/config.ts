import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ctaText',
      type: 'text',
      admin: {
        description: 'Button text (e.g., "Get Started")',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        description: 'Button URL',
        condition: (data, siblingData) => Boolean(siblingData?.ctaText),
      },
    },
  ],
}
