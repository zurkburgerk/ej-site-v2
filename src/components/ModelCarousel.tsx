'use client'

import { ReactElement, Suspense, useEffect, useRef, useState } from 'react'
import { Model } from '@/payload-types'
import { motion } from 'motion/react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'
import { formatListDrawerSlug } from '@payloadcms/ui/elements/ListDrawer'

export type ModelCarouselProps = {
	models: Model[]
}

export default function ModelCarousel({ models }: ModelCarouselProps): ReactElement {
	const [index, setIndex] = useState(0)
	let isScrolling = useRef(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const [slideWidth, setSlideWidth] = useState(0)

	const maxIndex = models.length - 1

	useEffect(() => {
		const updateWidth = () => {
			if (containerRef.current) setSlideWidth(containerRef.current.clientWidth)
		}
		updateWidth()
		window.addEventListener('resize', updateWidth)
		return () => window.removeEventListener('resize', updateWidth)
	})

	return (
		<div
			ref={containerRef}
			className="ModelCarouselWrapper"
			style={{ overflow: 'hidden', width: '100%', height: '100%' }}
		>
			<motion.div
				className="ModelCarousel"
				onWheel={(e) => {
					e.preventDefault()

					if (!slideWidth) return
					if (isScrolling.current) return
					isScrolling.current = true

					setIndex((prev) => {
						return e.deltaY > 0 ? Math.min(prev + 1, maxIndex) : Math.max(prev - 1, 0)
					})

					setTimeout(() => {
						isScrolling.current = false
					}, 500)
				}}
				style={{
					display: 'flex',
					height: '100%',
				}}
				animate={{
					x: index * -slideWidth,
				}}
				transition={{
					type: 'spring',
					stiffness: 120,
					damping: 20,
				}}
			>
				{models.map(
					(model, index) =>
						model.url && (
							<motion.div
								key={model.url}
								style={{
									flex: '0 0 100%',
									height: '100%',
									padding: '1rem',
									boxSizing: 'border-box',
								}}
							>
								<h2>{model.title}</h2>
								<CanvasAndModel model={model} />
							</motion.div>
						),
				)}
			</motion.div>
		</div>
	)
}

function CanvasAndModel({ model }: { model: Model }) {
	return (
		<Canvas
			style={{ width: '75%', height: '75%', pointerEvents: 'none' }}
			camera={{ position: [0, 1.5, 6], fov: 50 }}
		>
			<ambientLight intensity={0.4} />
			<Suspense fallback={null}>
				<Stage environment="city" intensity={0.8}>
					<GLTFModel url={model.url ?? ''} />
				</Stage>
				<OrbitControls
					autoRotate
					autoRotateSpeed={1}
					enablePan={false}
					enableZoom={false}
					enableRotate={false}
				/>
			</Suspense>
		</Canvas>
	)
}

type GLTFModelProps = {
	url: string
	scale?: number
}

function GLTFModel({ url, scale = 1 }: GLTFModelProps) {
	const { scene } = useGLTF(url)
	return <primitive object={scene} scale={scale} />
}
