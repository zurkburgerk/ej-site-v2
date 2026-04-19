import { headers as getHeaders } from 'next/headers.js'
import { getPayload, PaginatedDocs } from 'payload'

import config from '@/payload.config'
import { Model } from '@/payload-types'
import ModelCarousel from '@/components/3D/ModelCarousel'
import { CSSProperties } from 'react'

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

	return <div className="flex flex-col h-screen">howdy</div>
}
