import { getPayload } from 'payload'
import config from '@payload-config'
import { StaticHeading } from '@/components/heading/StaticHeading'
import Link from 'next/link'
import ModelCanvas from '@/components/Model/ModelCanvas'

export const dynamic = 'force-dynamic'

export default async function Page() {
	const payload = await getPayload({ config })
	const { docs } = await payload.find({
		collection: 'projects',
		depth: 2,
	})

	return (
		<main>
			<StaticHeading label="EMON JOHNSON" />
			<div className="relative m-10 z-20 text-xl">
				<div className="grid grid-cols-12 gap-4">
					{docs.map((project, index) => (
						<div
							className="col-span-4 hover:text-orange-500 hover:bg-gray-100 transition-colors duration-300 "
							key={index}
						>
							<Link href={'/projects/' + project.slug}>
								<div className="p-4">
									<ModelCanvas
										url={
											typeof project.model !== 'number' && project.model.url
												? project.model.url
												: ''
										}
										fadeIn
										zoomed
										mouseTrackX
										mouseTrackY
									/>
								</div>
								<div className="bg-white">
									<hr />
									<h3 className="font-thin mb-0">{project.title}</h3>
									<p className="text-xs mt-0">{project.year}</p>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</main>
	)
}
