import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'

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

	return (
		<main>
			<RichText data={page.content} />
		</main>
	)
}
