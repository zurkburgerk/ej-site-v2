import { headers as getHeaders } from 'next/headers.js'
import { getPayload, PaginatedDocs } from 'payload'

import config from '@/payload.config'
import './styles.css'
import { Model, Project, ModelsSelect } from '@/payload-types'
import ModelCarousel from '@/components/Model/ModelCarousel'
import { ExpandingNavButton } from '@/components/buttons/ExpandingNavButton'
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
				<div className="col-span-12 sm:col-span-9 overflow-hidden">
					<ModelCarousel projects={projects} />
				</div>
				<div className="col-span-12 sm:col-span-3 flex flex-col sm:flex-col h-full">
					<div className="hidden sm:flex flex-1 items-center justify-center">
						<ExpandingNavButton label="PROJECTS" href="/projects" />
					</div>
					<div className="hidden sm:flex flex-1 items-center justify-center">
						<ExpandingNavButton label="ABOUT" href="/about" />
					</div>
					<div className="hidden sm:flex flex-1 items-center justify-center">
						<ExpandingNavButton label="CONTACT" href="/contact" />
					</div>

					{/* mobile buttons */}
					<div className="sm:hidden flex flex-row gap-4 p-4">
						<div className="flex-1 flex items-center justify-center">
							<ExpandingNavButton label="PROJECTS" href="/projects" />
						</div>
						<div className="flex-1 flex items-center justify-center">
							<ExpandingNavButton label="ABOUT" href="/about" />
						</div>
						<div className="flex-1 flex items-center justify-center">
							<ExpandingNavButton label="CONTACT" href="/contact" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
