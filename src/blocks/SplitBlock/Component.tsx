import { RichText } from '@/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
	left: SerializedEditorState
	right: SerializedEditorState
}

export const SplitBlockComponent = ({ left, right }: Props) => {
	return (
		<div className="grid grid-cols-12 gap-4">
			<div className="sm:col-span-6 col-span-12">
				<RichText data={left} />
			</div>
			<div className="sm:col-span-6 col-span-12">
				<RichText data={right} />
			</div>
		</div>
	)
}
