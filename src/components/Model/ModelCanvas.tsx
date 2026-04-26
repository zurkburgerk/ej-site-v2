'use client'

import { Canvas } from '@react-three/fiber'
import AnimatedModel from './AnimatedModel'
import { Suspense } from 'react'

export type ModelCanvasProps = {
	url: string
	transition?: 'fromRight' | 'fromLeft'
	fadeIn?: boolean
	autoRotate?: boolean
	mouseTrackX?: boolean
	mouseTrackY?: boolean
}

export default function ModelCanvas({
	url,
	transition,
	fadeIn,
	autoRotate,
	mouseTrackX,
	mouseTrackY,
}: ModelCanvasProps) {
	return (
		<Canvas
			camera={{ position: [0, 2, 5], rotateX: -45, fov: 50 }}
			gl={{ antialias: true, powerPreference: 'low-power' }}
			dpr={[1, 1.5]}
			key={url}
		>
			<ambientLight intensity={3} />
			<directionalLight position={[5, 10, 5]} intensity={4} castShadow={false} />
			<directionalLight position={[-5, 5, -5]} intensity={2} />
			<Suspense fallback={null}>
				{url && (
					<AnimatedModel
						url={url}
						fadeIn={fadeIn}
						mouseTrackX={mouseTrackX}
						mouseTrackY={mouseTrackY}
						autoRotate={autoRotate}
						transition={transition}
					/>
				)}
			</Suspense>
		</Canvas>
	)
}
