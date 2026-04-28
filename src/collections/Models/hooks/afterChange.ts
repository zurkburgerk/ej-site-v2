import type { CollectionAfterChangeHook } from 'payload'
import { optimizeGLTF } from '../utils/optimizeGLTF'
import path from 'path'
import fs from 'fs/promises'

async function waitForFile(filePath: string, retries = 10, delayMs = 300): Promise<void> {
	for (let i = 0; i < retries; i++) {
		try {
			await fs.access(filePath)
			return // file exists
		} catch {
			await new Promise((res) => setTimeout(res, delayMs))
		}
	}
	throw new Error(`File never appeared: ${filePath}`)
}

export const afterChange: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
	if (operation !== 'create') return doc

	const filename = doc.filename
	if (!filename) return doc

	const uploadDir = path.resolve(process.cwd(), 'media/models')
	const filePath = path.join(uploadDir, filename)
	const isGLTF = filename.endsWith('.gltf')

	try {
		await waitForFile(filePath)
		await optimizeGLTF(filePath)

		//get new file stats
		const glbPath = path.join(uploadDir, filename.replace(/\.gltf$/, '.glb'))
		const stats = await fs.stat(isGLTF ? glbPath : filePath)

		await req.payload.update({
			collection: 'models',
			id: doc.id,
			data: {
				optimized: true,
				filesize: stats.size,
				mimeType: 'model/gltf-binary',
				...(isGLTF && {
					filename: filename.replace(/\.gltf$/, '.glb'),
					url: `/api/models/file/${encodeURIComponent(filename.replace(/\.gltf$/, '.glb'))}`,
				}),
			},
		})

		// clean up old gltf file
		if (isGLTF) {
			const files = await fs.readdir(uploadDir)
			const baseName = path.basename(filename, '.gltf')
			const related = files.filter((f) => f.startsWith(baseName) && !f.endsWith('.glb'))
			await Promise.all(related.map((f) => fs.unlink(path.join(uploadDir, f))))
		}
	} catch (err) {
		console.error(`[gltf-optimize] Failed for ${filename}:`, err)
	}

	return doc
}
