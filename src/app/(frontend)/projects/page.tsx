import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { Model } from '@/payload-types'
import { StaticHeading } from '@/components/heading/StaticHeading'

export default async function Page() {
	const payload = await getPayload({ config })

	const { docs } = await payload.find({
		collection: 'projects',
		depth: 2, // populates the model relationship inside the block
	})

	const projects = docs[0]

	if (!projects) notFound()

	return (
		<main>
			<StaticHeading label="EMON JOHNSON" />
			<div className="relative m-10 z-20 text-xl">
				<h2>Projects</h2>
			</div>
		</main>
	)
}
