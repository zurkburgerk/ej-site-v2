import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { ModelBlock } from '../ModelBlock/config'

export const SplitBlock: Block = {
	slug: 'splitBlock',
	labels: {
		singular: 'Split Block',
		plural: 'Split Blocks',
	},
	fields: [
		{
			name: 'left',
			type: 'richText',
			editor: lexicalEditor({
				features: ({ defaultFeatures }) => [
					...defaultFeatures,
					BlocksFeature({
						blocks: [ModelBlock],
					}),
				],
			}),
		},
		{
			name: 'right',
			type: 'richText',
			editor: lexicalEditor({
				features: ({ defaultFeatures }) => [
					...defaultFeatures,
					BlocksFeature({
						blocks: [ModelBlock],
					}),
				],
			}),
		},
	],
}
