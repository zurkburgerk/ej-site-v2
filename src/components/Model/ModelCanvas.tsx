'use client'

import { Canvas, Vector3 } from '@react-three/fiber'
import AnimatedModel from './AnimatedModel'
import { Suspense, useEffect, useRef } from 'react'

export type ModelCanvasProps = {
	url: string
	transition?: 'fromRight' | 'fromLeft'
	fadeIn?: boolean
	autoRotate?: boolean
	mouseTrackX?: boolean
	mouseTrackY?: boolean
	zoomed?: boolean
}

export default function ModelCanvas({
	url,
	transition,
	fadeIn,
	autoRotate,
	mouseTrackX,
	mouseTrackY,
	zoomed,
}: ModelCanvasProps) {
	const cameraPosition: Vector3 = zoomed ? [0, 1.5, 3] : [0, 2, 5]
	const touchStart = useRef<{ x: number; y: number } | null>(null)
	const rotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
	const wrapperRef = useRef<HTMLCanvasElement>(null)

	const handleTouchStart = (e: React.TouchEvent) => {
		const t = e.touches[0]
		touchStart.current = { x: t.clientX, y: t.clientY }
	}

	const handleTouchEnd = () => {
		touchStart.current = null
		rotation.current = { x: 0, y: 0 }
	}

	useEffect(() => {
		const el = wrapperRef.current
		if (!el) return

		const onTouchMove = (e: TouchEvent) => {
			e.preventDefault()
			if (!touchStart.current) return
			const t = e.touches[0]
			const dx = t.clientX - touchStart.current.x
			const dy = t.clientY - touchStart.current.y
			console.log(dx + ' ' + dy)
			rotation.current = { x: dy / 200, y: dx / 200 }
			touchStart.current = { x: t.clientX, y: t.clientY }
		}

		el.addEventListener('touchmove', onTouchMove, { passive: false })
		return () => el.removeEventListener('touchmove', onTouchMove)
	}, [])

	return (
		<Canvas
			ref={wrapperRef}
			camera={{ position: cameraPosition, rotateX: -45, fov: 50 }}
			gl={{ antialias: true, powerPreference: 'low-power' }}
			dpr={[1, 1.5]}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			// key={url}
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
						externalRotation={rotation}
					/>
				)}
			</Suspense>
		</Canvas>
	)
}
