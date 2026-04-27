import {
	RichText as PayloadRichText,
	type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import { ModelBlockComponent } from '@/blocks/ModelBlock/Component'
import { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { Model } from '@/payload-types'
import { SplitBlockComponent } from '@/blocks/SplitBlock/Component'

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

type SplitBlock = {
	left: any
	right: any
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
		splitBlock: ({ node }: { node: SerializedBlockNode<SplitBlock> }) => (
			<SplitBlockComponent left={node.fields.left} right={node.fields.right} />
		),
	},
})

export const RichText = ({ data }: { data: any }) => (
	<PayloadRichText data={data} converters={jsxConverters} />
)
