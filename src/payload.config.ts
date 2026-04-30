import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import fs from 'fs'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Models } from './collections/Models'
import { Projects } from './collections/Projects'
import { ModelBlock } from './blocks/ModelBlock/config'
import { Pages } from './collections/Pages'
import { SplitBlock } from './blocks/SplitBlock/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [Users, Models, Projects, Pages, Media],
	editor: lexicalEditor({
		features: ({ defaultFeatures }) => [
			...defaultFeatures,
			BlocksFeature({
				blocks: [ModelBlock, SplitBlock],
			}),
		],
	}),
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	db: sqliteAdapter({
		client: {
			url: process.env.DATABASE_URL || '',
		},
	}),
	email: nodemailerAdapter({
		defaultFromAddress: 'noreply@thunde.net',
		defaultFromName: 'THUNDE - Web Admin Notifications',
		// Nodemailer transportOptions
		transportOptions: {
			host: process.env.SMTP_HOST,
			port: 587,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		},
	}),
	sharp,
	plugins: [],
})
