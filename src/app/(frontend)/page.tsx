import { headers as getHeaders } from 'next/headers.js'
import { getPayload, PaginatedDocs } from 'payload'

import config from '@/payload.config'
import './styles.css'
import { Project } from '@/payload-types'
import ModelCarousel from '@/components/Model/ModelCarousel'
import { EntryHeading } from '@/components/heading/EntryHeading'

export default async function HomePage() {
	const headers = await getHeaders()
	const payloadConfig = await config
	const payload = await getPayload({ config: payloadConfig })
	const { user } = await payload.auth({ headers })

	const payloadResult: PaginatedDocs<Project> = await payload.find({
		collection: 'projects',
		depth: 1,
	})

	const projects = payloadResult.docs

	return (
		<div className="flex flex-col h-screen">
			<EntryHeading label="EMON JOHNSON" />

			<div className="grid grid-cols-12 flex-1 overflow-hidden">
				<div className="col-span-12 sm:col-span-12 overflow-hidden">
					<ModelCarousel projects={projects} />
				</div>
			</div>
		</div>
	)
}
