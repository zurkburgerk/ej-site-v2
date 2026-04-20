'use client'
import { ReactElement, Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { Model } from '@/payload-types'
import { motion } from 'motion/react'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import AnimatedModel from './AnimatedModel'

export type ModelCarouselProps = {
	models: Model[]
}

export default function ModelCarousel({ models }: ModelCarouselProps): ReactElement {
	const [index, setIndex] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const [slideWidth, setSlideWidth] = useState(0)
	const maxIndex = models.length - 1
	const isScrolling = useRef(false)
	const [direction, setDirection] = useState<'fromRight' | 'fromLeft'>('fromRight')
	const deltaAccumulator = useRef(0)
	const SCROLL_THRESHOLD = 100

	useEffect(() => {
		const updateWidth = () => {
			if (containerRef.current) setSlideWidth(containerRef.current.clientWidth)
		}
		updateWidth()
		window.addEventListener('resize', updateWidth)
		return () => window.removeEventListener('resize', updateWidth)
	}, [])

	const handleWheel = useCallback(
		(e: React.WheelEvent) => {
			e.preventDefault()
			if (!slideWidth || isScrolling.current) return

			deltaAccumulator.current += e.deltaY

			if (Math.abs(deltaAccumulator.current) < SCROLL_THRESHOLD) return

			isScrolling.current = true
			const scrollDirection = deltaAccumulator.current > 0 ? 1 : -1
			deltaAccumulator.current = 0

			setDirection(scrollDirection > 0 ? 'fromRight' : 'fromLeft')
			setIndex((prev) => {
				let nextIndex = Math.min(Math.max(prev + scrollDirection, 0), maxIndex)
				if (nextIndex !== prev) {
					setTimeout(() => {
						isScrolling.current = false
					}, 700)
				} else {
					isScrolling.current = false
				}
				return nextIndex
			})
		},
		[slideWidth, maxIndex],
	)

	const currentModel = models[index]

	return (
		<div
			ref={containerRef}
			className="flex flex-col"
			onWheel={handleWheel}
			style={{
				overflow: 'hidden',
				width: '100%',
				height: '100%',
				position: 'relative',
				scrollBehavior: 'auto',
			}}
		>
			<PreloadModels models={models} />

			<div className="flex-1 w-full">
				<Canvas
					camera={{ position: [0, 2, 5], rotateX: -45, fov: 50 }}
					gl={{ antialias: true, powerPreference: 'low-power' }}
					dpr={[1, 1.5]}
				>
					<ambientLight intensity={3} />
					<directionalLight position={[5, 10, 5]} intensity={4} castShadow={false} />
					<directionalLight position={[-5, 5, -5]} intensity={2} />
					<Suspense fallback={null}>
						{currentModel?.url && (
							<AnimatedModel
								url={currentModel.url}
								fadeIn
								autoRotate
								mouseTrackX
								transition={direction}
							/>
						)}
					</Suspense>
				</Canvas>
			</div>

			<motion.div
				className="flex z-10 pt-4 pb-4"
				animate={{ x: index * -slideWidth }}
				transition={{ type: 'spring', stiffness: 300, damping: 35 }}
			>
				{models.map(
					(model) =>
						model.url && (
							<motion.div
								key={model.url}
								className="flex flex-none w-full justify-center text-center"
							>
								<h2 className="text-3xl">{model.title}</h2>
							</motion.div>
						),
				)}
			</motion.div>
			<div className="flex flex-row gap-4 items-center justify-center pt-4 pb-8">
				{models.map((_, i) => {
					let className =
						'z-10 aspect-square w-2 h-2 border-1 border-gray-500 transition-all duration-300'
					if (i === index) {
						className += ' bg-gray-500 shadow-[4px_4px_6px_rgba(0,0,0,0.3)]'
					}

					return (
						<div
							className={className}
							onClick={() => {
								if (i > index) {
									setDirection('fromRight')
								} else {
									setDirection('fromLeft')
								}
								setIndex(i)
							}}
							key={i}
						/>
					)
				})}
			</div>
		</div>
	)
}

function PreloadModels({ models }: { models: Model[] }) {
	useEffect(() => {
		models.forEach((m) => {
			if (m.url) useGLTF.preload(m.url)
		})
	}, [models])
	return null
}
