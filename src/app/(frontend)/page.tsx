import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload, PaginatedDocs } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import { Model } from '@/payload-types'
import ModelCarousel from '@/components/ModelCarousel'

export default async function HomePage() {
	const headers = await getHeaders()
	const payloadConfig = await config
	const payload = await getPayload({ config: payloadConfig })
	const { user } = await payload.auth({ headers })

	const payloadResult: PaginatedDocs<Model> = await payload.find({
		collection: 'models',
	})

	const models: Model[] = payloadResult.docs

	return (
		<div className="home">
			<div className="content">
				<div
					style={{
						height: '75vh',
						width: '75vw',
					}}
				>
					<ModelCarousel models={models} />
				</div>
			</div>
		</div>
	)
}
