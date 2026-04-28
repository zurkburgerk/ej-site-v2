import type { CollectionConfig } from 'payload'
import { afterChange } from './hooks/afterChange'

export const Models: CollectionConfig = {
	slug: 'models',
	access: {
		read: () => true,
	},
	hooks: {
		afterChange: [afterChange],
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			name: 'optimized',
			type: 'checkbox',
			defaultValue: false,
			admin: {
				readOnly: true,
				description:
					'Checked automatically after optimization finishes. Optimization is run automatically after upload.',
			},
		},
	],
	upload: {
		staticDir: 'media/models',
	},
}
