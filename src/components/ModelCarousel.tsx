'use client'
import { ReactElement, Suspense, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Model } from '@/payload-types'
import { motion } from 'motion/react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Bounds } from '@react-three/drei'
import * as THREE from 'three'

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
	const SCROLL_THRESHOLD = 50

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
			if (!slideWidth) return
			if (isScrolling.current) return

			deltaAccumulator.current += e.deltaY

			if (Math.abs(deltaAccumulator.current) < SCROLL_THRESHOLD) return

			const scrollDirection = deltaAccumulator.current > 0 ? 1 : -1
			setDirection(scrollDirection > 0 ? 'fromRight' : 'fromLeft')
			deltaAccumulator.current = 0

			isScrolling.current = true
			setIndex((prev) => Math.min(Math.max(prev + scrollDirection, 0), maxIndex))

			setTimeout(() => {
				isScrolling.current = false
			}, 700)
		},
		[slideWidth, maxIndex],
	)

	const currentModel = models[index]

	return (
		<div
			ref={containerRef}
			className="ModelCarouselWrapper"
			onWheel={handleWheel}
			style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'relative' }}
		>
			<PreloadModels models={models} />

			<div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
				<Canvas
					camera={{ position: [0, 0, 5], fov: 50 }}
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

			{/* Slide UI overlay — handles scroll and shows titles */}
			<motion.div
				className="ModelCarousel"
				style={{
					display: 'flex',
					height: '100%',
					position: 'relative',
					zIndex: 1,
				}}
				animate={{ x: index * -slideWidth }}
				transition={{ type: 'spring', stiffness: 300, damping: 35 }}
			>
				{models.map(
					(model) =>
						model.url && (
							<motion.div
								key={model.url}
								style={{
									flex: '0 0 100%',
									height: '100%',
									padding: '1rem',
									boxSizing: 'border-box',
									pointerEvents: 'none',
								}}
							>
								<h2>{model.title}</h2>
							</motion.div>
						),
				)}
			</motion.div>
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

type AnimatedModelProps = {
	url: string
	transition?: 'fromRight' | 'fromLeft'
	fadeIn?: boolean
	autoRotate?: boolean
	mouseTrackX?: boolean
	mouseTrackY?: boolean
}

function AnimatedModel({
	url,
	transition,
	fadeIn,
	autoRotate,
	mouseTrackX,
	mouseTrackY,
}: AnimatedModelProps) {
	const { scene } = useGLTF(url)
	const groupRef = useRef<THREE.Group>(null)
	const mouse = useRef({ x: 0, y: 0 })

	// Center the scene geometry at origin using bounding box
	const centeredScene = useMemo(() => {
		const cloned = scene.clone(true)

		const box = new THREE.Box3().setFromObject(cloned)
		const center = new THREE.Vector3()
		const size = new THREE.Vector3()

		box.getCenter(center)
		box.getSize(size)

		const maxDim = Math.max(size.x, size.y, size.z)
		const scale = 3 / maxDim // normalize to fit in a 3-unit space

		const pivot = new THREE.Group()

		cloned.position.sub(center)

		pivot.add(cloned)
		pivot.scale.setScalar(scale)

		return pivot
	}, [scene])

	// mouse capture for paralax effect
	useEffect(() => {
		const handleMove = (e: MouseEvent) => {
			mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
			mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
		}

		window.addEventListener('mousemove', handleMove)
		return () => window.removeEventListener('mousemove', handleMove)
	})

	// Set starting state on mount/swap
	useEffect(() => {
		if (!groupRef.current) return

		if (transition === 'fromRight') {
			groupRef.current.position.x = 10
		} else if (transition === 'fromLeft') {
			groupRef.current.position.x = -10
		}

		if (fadeIn) {
			groupRef.current.traverse((obj: any) => {
				if (obj.material) {
					obj.material.transparent = true
					obj.material.opacity = 0
				}
			})
		}
	}, [url])

	// Perform animations
	useFrame((_, delta) => {
		if (!groupRef.current) return

		const parallaxStrength = 0.1

		if (mouseTrackY) {
			groupRef.current.rotation.y +=
				(mouse.current.x * parallaxStrength - groupRef.current.rotation.y) * 0.1
		}

		if (mouseTrackX) {
			groupRef.current.rotation.x +=
				(mouse.current.y * parallaxStrength - groupRef.current.rotation.x) * 0.1
		}

		if (transition != null) {
			groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, delta * 8)
		}

		if (fadeIn) {
			groupRef.current.traverse((obj: any) => {
				if (obj.material) {
					obj.material.opacity = Math.min(obj.material.opacity + delta, 1)
				}
			})
		}

		if (autoRotate) {
			groupRef.current.rotation.y += delta * 0.5
		}
	})

	return (
		<group ref={groupRef}>
			<primitive object={centeredScene} />
		</group>
	)
}
