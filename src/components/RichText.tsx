import {
	RichText as PayloadRichText,
	type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import { ModelBlockComponent } from '@/blocks/ModelBlock/Component'
import { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { Model } from '@/payload-types'

type ModelBlock = {
	model: Model
	height?: number
	transition?: 'none' | 'fromRight' | 'fromLeft'
	autoRotate?: boolean
	fadeIn?: boolean
	mouseTrackX?: boolean
	mouseTrackY?: boolean
	blockType: 'modelBlock'
	id?: string
}

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
	...defaultConverters,
	blocks: {
		...defaultConverters.blocks,
		modelBlock: ({ node }: { node: SerializedBlockNode<ModelBlock> }) => (
			<ModelBlockComponent
				key={node.fields.id}
				model={node.fields.model}
				height={node.fields.height}
				transition={node.fields.transition !== 'none' ? node.fields.transition : undefined}
				autoRotate={node.fields.autoRotate}
				fadeIn={node.fields.fadeIn}
				mouseTrackX={node.fields.mouseTrackX}
				mouseTrackY={node.fields.mouseTrackY}
			/>
		),
	},
})

export const RichText = ({ data }: { data: any }) => (
	<PayloadRichText data={data} converters={jsxConverters} />
)
