import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
	slug: 'projects',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'updatedAt'],
	},
	versions: {
		drafts: true,
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			admin: {
				readOnly: true,
				position: 'sidebar',
			},
			hooks: {
				beforeChange: [
					({ data, operation }) => {
						if (operation === 'create' && data && data.title) {
							data.slug = data.title
								.toLowerCase()
								.trim()
								.replace(/[^\w\s-]/g, '') // Remove special characters
								.replace(/\s+/g, '-') // Replace spaces with hyphens
								.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
						}
					},
				],
			},
		},
		{
			name: 'model',
			type: 'relationship',
			relationTo: 'models',
			required: true,
		},
		{
			name: 'content',
			type: 'richText',
		},
		{
			name: 'meta',
			type: 'group',
			label: 'SEO',
			admin: {
				position: 'sidebar',
			},
			fields: [
				{
					name: 'title',
					type: 'text',
					label: 'Meta Title',
				},
				{
					name: 'description',
					type: 'textarea',
					label: 'Meta Description',
				},
				{
					name: 'image',
					type: 'upload',
					relationTo: 'media',
					label: 'OG Image',
				},
			],
		},
		{
			name: 'publishedAt',
			type: 'date',
			admin: {
				position: 'sidebar',
				date: { pickerAppearance: 'dayAndTime' },
			},
		},
	],
}
