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
	const SWIPE_THRESHOLD = 100
	const [touchStart, setTouchStart] = useState<number | null>(null)
	const [touchEnd, setTouchEnd] = useState<number | null>(null)
	const [hintReady, setHintReady] = useState(false)

	useEffect(() => {
		const alreadyShown = sessionStorage.getItem('carouselHintShown')

		if (alreadyShown) {
			setHintReady(false) // never show again this session
			return
		}

		const handler = () => {
			sessionStorage.setItem('carouselHintShown', 'true')
			setHintReady(true)
		}
		window.addEventListener('entryAnimationComplete', handler)
		return () => window.removeEventListener('entryAnimationComplete', handler)
	}, [])

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

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchEnd(null)
		setTouchStart(e.targetTouches[0].clientX)
	}

	const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

	const handleTouchEnd = () => {
		if (!touchStart || !touchEnd) return
		const distance = touchStart - touchEnd

		if (distance > SWIPE_THRESHOLD) {
			//scroll right
			setDirection('fromRight')
			setIndex((prev) => {
				return Math.min(prev + 1, maxIndex)
			})
		} else if (distance < -SWIPE_THRESHOLD) {
			//scroll left
			setDirection('fromLeft')
			setIndex((prev) => {
				return Math.max(prev - 1, 0)
			})
		}
	}

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
					onTouchStart={handleTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={handleTouchEnd}
					className="md:w-2/3 w-full flex flex-1 flex-col min-h-0 h-full justify-between relative"
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
								touchTrackY
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
					{hintReady && (
						<motion.div
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 shadow-[8px_8px_rgba(0,0,0,0.2)]"
							initial={{ opacity: 1 }}
							animate={{ opacity: 0 }}
							transition={{ delay: 7, duration: 0.5, ease: 'easeOut' }}
						>
							<p className="text-orange-500">SCROLL / SWIPE</p>
						</motion.div>
					)}
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
