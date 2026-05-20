'use client'
import { ReactElement, Suspense, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Model, Project } from '@/payload-types'
import { motion } from 'motion/react'
import { useGLTF } from '@react-three/drei'
import ModelCanvas from './ModelCanvas'
import Link from 'next/link'

export type ModelCarouselProps = {
	projects: Project[]
}

export default function ModelCarousel({ projects }: ModelCarouselProps): ReactElement {
	const [index, setIndex] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const [slideWidth, setSlideWidth] = useState(0)
	const maxIndex = projects.length - 1
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
	const allModels: Model[] = useMemo(
		() =>
			projects
				.map((project) => project.model)
				.filter((model): model is Model => typeof model !== 'number'),
		[projects],
	)

	const currentProject = projects[index]
	const currentProjectModel: Model | null = useMemo(
		() =>
			currentProject && typeof currentProject.model !== 'number' ? currentProject.model : null,
		[currentProject],
	)

	if (currentProject) {
		return (
			<div className="flex flex-col md:flex-row h-full w-full" onWheel={handleWheel}>
				<div className="md:w-1/3 w-full md:h-full flex flex-col justify-center md:items-center flex-shrink-0 md:ml-0 ml-2">
					<motion.div
						key={index}
						className="md:mt-0 mt-4"
						initial={direction === 'fromRight' ? { opacity: 0, x: 100 } : { opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
					>
						<h2 className="md:text-4xl text-3xl text-orange-500">{currentProject.title}</h2>
						<p>{currentProject.year}</p>
					</motion.div>
				</div>
				<div
					ref={containerRef}
					className="md:w-2/3 w-full flex flex-1 flex-col min-h-0 h-full justify-between"
				>
					<PreloadModels models={allModels} index={index} />

					{/* grow forces the canvas wrapper to expand as big as possible */}
					<div className="w-full flex-grow min-h-0">
						<Link href={'/projects/' + currentProject.slug} className="block h-full w-full">
							<ModelCanvas
								url={currentProjectModel && currentProjectModel.url ? currentProjectModel.url : ''}
								fadeIn
								autoRotate
								mouseTrackX
								transition={direction}
							/>
						</Link>
					</div>

					<div className="flex flex-row gap-4 items-center justify-center pt-4 pb-8 flex-shrink-0">
						{projects.map((_, i) => {
							let className =
								'z-10 aspect-square w-4 h-2 border-1 border-black transition-all duration-300 hover:shadow-[2px_2px__rgba(0,0,0,0.3)] cursor-pointer'
							if (i === index) {
								className += ' bg-orange-500 border-orange-500 shadow-[2px_2px__rgba(0,0,0,0.3)]'
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
			</div>
		)
	} else {
		return <div />
	}
}

function PreloadModels({ models, index }: { models: Model[]; index: number }) {
	const modelsToPreload = useMemo(() => {
		const preload: Model[] = []
		if (models[index]) preload.push(models[index])
		if (models[index - 1]) preload.push(models[index - 1])
		if (models[index + 1]) preload.push(models[index + 1])
		return preload
	}, [models, index])

	useEffect(() => {
		modelsToPreload.forEach((m) => {
			if (m.url) useGLTF.preload(m.url)
		})
	}, [modelsToPreload])
	return null
}
