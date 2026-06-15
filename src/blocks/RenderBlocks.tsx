import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { Component as HeroBlock } from './Hero'
import { Component as ContentBlock } from './Content'
import { Component as CallToActionBlock } from './CallToAction/'

type LayoutBlock = NonNullable<Page['layout']>[number]

const blockComponents: Record<string, React.FC<any>> = {
  hero: HeroBlock,
  content: ContentBlock,
  calltoaction: CallToActionBlock,
}

export const RenderBlocks: React.FC<{
  blocks: LayoutBlock[]
}> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]
          if (Block) {
            return (
              <div key={index}>
                <Block {...block} />
              </div>
            )
          }
        }

        return null
      })}
    </Fragment>
  )
}
