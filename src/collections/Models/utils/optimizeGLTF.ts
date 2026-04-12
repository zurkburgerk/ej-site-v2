import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { draco, textureCompress, dedup, flatten, join, weld } from '@gltf-transform/functions'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

export async function optimizeGLTF(inputPath: string): Promise<void> {
	const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)

	const dracoEncoderPath = path.resolve(process.cwd(), 'node_modules/draco3d/draco_encoder.wasm')
	const dracoDecoderPath = path.resolve(process.cwd(), 'node_modules/draco3d/draco_decoder.wasm')

	const { createEncoderModule, createDecoderModule } = await import('draco3d')

	const [dracoEncoder, dracoDecoder] = await Promise.all([
		createEncoderModule({ wasmBinary: await fs.readFile(dracoEncoderPath) }),
		createDecoderModule({ wasmBinary: await fs.readFile(dracoDecoderPath) }),
	])

	io.registerDependencies({
		'draco3d.encoder': dracoEncoder,
		'draco3d.decoder': dracoDecoder,
	})

	const document = await io.read(inputPath)
	const isGLTF = inputPath.endsWith('.gltf')
	const glbPath = isGLTF ? inputPath.replace(/\.gltf$/, '.glb') : inputPath

	// If gltf, merge buffers in memory first, then write as glb
	if (isGLTF) {
		const root = document.getRoot()
		const buffers = root.listBuffers()

		if (buffers.length > 1) {
			const firstBuffer = buffers[0]
			root.listAccessors().forEach((accessor) => accessor.setBuffer(firstBuffer))
			buffers.slice(1).forEach((buffer) => buffer.dispose())
		}

		await io.write(glbPath, document)
	}

	// Re-read the glb and optimize
	const glbDocument = await io.read(glbPath)

	await glbDocument.transform(
		dedup(),
		flatten(),
		join(),
		weld(),
		draco(),
		textureCompress({
			encoder: sharp,
			targetFormat: 'webp',
			resize: [2048, 2048],
		}),
	)

	await io.write(glbPath, glbDocument)

	console.log(`[gltf-optimize] Done: ${path.basename(glbPath)}`)
}
