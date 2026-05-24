import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin:{
      useAsTitle:'title'
    },
    fields:[{
      name:'title',
      type:'text',
      required:true
    },
    {
       name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
      relationTo:'cars'
    },
    {
      name: 'cars',  // Collection reference to cars
      type: 'relationship',
      relationTo: 'cars',
      hasMany: true, // If you want multiple cars to be linked to the page
    },   
    ]
}