import { useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export type AnimatedModelProps = {
	url: string
	transition?: 'fromRight' | 'fromLeft'
	fadeIn?: boolean
	autoRotate?: boolean
	mouseTrackX?: boolean
	mouseTrackY?: boolean
}

export default function AnimatedModel({
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
