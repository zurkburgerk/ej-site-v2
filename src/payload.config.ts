import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
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

// Extract and create database directory
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL environment variable is not set')
}

const dbFilePath = databaseUrl.replace('file:', '')
const resolvedDbPath = path.isAbsolute(dbFilePath) ? dbFilePath : path.resolve(dirname, dbFilePath)
const dbDir = path.dirname(resolvedDbPath)

if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true })
}

export default buildConfig({
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
			url: databaseUrl,
		},
	}),
	sharp,
	plugins: [],
})
