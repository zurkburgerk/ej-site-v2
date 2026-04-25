import { CollectionConfig } from 'payload'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { ModelBlock } from '@/blocks/ModelBlock/config'

export const Pages: CollectionConfig = {
	slug: 'pages',
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
				position: 'sidebar',
			},
			hooks: {
				beforeValidate: [
					({ value, data }) =>
						value ||
						data?.title
							?.toLowerCase()
							.replace(/\s+/g, '-')
							.replace(/[^\w-]/g, ''),
				],
			},
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
