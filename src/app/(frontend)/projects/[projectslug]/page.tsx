import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import ModelCanvas from '@/components/Model/ModelCanvas'
import { Model } from '@/payload-types'
import { StaticHeading } from '@/components/heading/StaticHeading'

export default async function Page({ params }: { params: Promise<{ projectslug: string }> }) {
	const { projectslug } = await params
	const payload = await getPayload({ config })

	const { docs } = await payload.find({
		collection: 'projects',
		where: {
			slug: { equals: projectslug },
		},
		depth: 2, // populates the model relationship inside the block
		limit: 1,
	})

	const page = docs[0]

	if (!page) notFound()

	const model: Model | null = typeof page.model !== 'number' ? page.model : null

	return (
		<main>
			{/* TODO: need a mobile version of this */}
			<div className="absolute flex flex-col top-0 left-0 w-1/3 h-1/3 z-10 items-center text-center">
				<div className="flex-1 w-full">
					<ModelCanvas
						key={projectslug}
						url={model && model.url ? model.url : ''}
						mouseTrackY
						mouseTrackX
						fadeIn
						transition="fromLeft"
					/>
				</div>
				<h2 className="-translate-y-full">{page.title}</h2>
			</div>
			<StaticHeading label="EMON JOHNSON" />
			<div className="relative m-10 mt-30 z-20 text-xl">
				<RichText data={page.content} />
			</div>
		</main>
	)
}
