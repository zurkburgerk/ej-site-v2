import { headers as getHeaders } from 'next/headers.js'
import { getPayload, PaginatedDocs } from 'payload'

import config from '@/payload.config'
import './styles.css'
import { Model } from '@/payload-types'
import ModelCarousel from '@/components/3D/ModelCarousel'
import { ExpandingNavButton } from '@/components/buttons/ExpandingNavButton'
import { EntryHeading } from '@/components/heading/EntryHeading'

export default async function HomePage() {
	const headers = await getHeaders()
	const payloadConfig = await config
	const payload = await getPayload({ config: payloadConfig })
	const { user } = await payload.auth({ headers })

	const payloadResult: PaginatedDocs<Model> = await payload.find({
		collection: 'models',
	})

	const models: Model[] = payloadResult.docs

	const navButtonClasses =
		'aspect-square max-h-25 w-25 bg-orange-500 hover:bg-orange-300 hover:shadow-[8px_8px_12px_rgba(0,0,0,0.2)] transition-all duration-300 flex items-center justify-center'

	return (
		<div className="flex flex-col h-screen">
			<div className="m-8">
				<EntryHeading label="EMON JOHNSON" />
			</div>
			<div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden">
				<div className="col-span-12 sm:col-span-9 overflow-hidden">
					<ModelCarousel models={models} />
				</div>
				<div className="col-span-12 sm:col-span-3 flex flex-col sm:flex-col h-full">
					<div className="hidden sm:flex flex-1 items-center justify-center">
						<ExpandingNavButton label="PROJECTS" href="/projects" />
					</div>
					<div className="hidden sm:flex flex-1 items-center justify-center">
						<div className={navButtonClasses}>
							<p className="text-xl">ABOUT</p>
						</div>
					</div>
					<div className="hidden sm:flex flex-1 items-center justify-center">
						<div className={navButtonClasses}>
							<p className="text-xl">CONTACT</p>
						</div>
					</div>

					{/* mobile buttons */}
					<div className="sm:hidden flex flex-row gap-4 p-4">
						<div className="flex-1 flex items-center justify-center">
							<ExpandingNavButton label="PROJECTS" href="/projects" />
						</div>
						<div className="flex-1 flex items-center justify-center">
							<div className={navButtonClasses}>
								<p className="text-xl">ABOUT</p>
							</div>
						</div>
						<div className="flex-1 flex items-center justify-center">
							<div className={navButtonClasses}>
								<p className="text-xl">CONTACT</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
