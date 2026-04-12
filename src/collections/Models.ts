import type { CollectionConfig } from 'payload'

export const Models: CollectionConfig = {
  slug: 'models',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: 'public/models',
  }
}
