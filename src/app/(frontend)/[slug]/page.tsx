import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { StaticHeading } from '@/components/heading/StaticHeading'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const payload = await getPayload({ config })

	const { docs } = await payload.find({
		collection: 'pages',
		where: {
			slug: { equals: slug },
		},
		depth: 2, // populates the model relationship inside the block
		limit: 1,
	})

	const page = docs[0]

	if (!page) notFound()

	return (
		<main>
			<StaticHeading label="EMON JOHNSON" />
			<div className="relative m-10 z-20 text-xl">
				<RichText data={page.content} />
			</div>
		</main>
	)
}
