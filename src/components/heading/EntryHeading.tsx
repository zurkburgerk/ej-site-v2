'use client'
import { animate } from 'motion/react'
import { useState, useRef, useLayoutEffect } from 'react'

export function EntryHeading({ label }: { label: string }) {
	const [done, setDone] = useState(false)
	const h1Ref = useRef<HTMLHeadingElement>(null)
	const textRef = useRef<HTMLHeadingElement>(null)
	const overlayRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		if (!h1Ref.current || !textRef.current || !overlayRef.current) return

		const rect = h1Ref.current.getBoundingClientRect()
		const fontSize = window.getComputedStyle(h1Ref.current).fontSize
		const targetTop = rect.top + rect.height / 2

		const sequence = async () => {
			await new Promise((res) => setTimeout(res, 100))

			// move text to final position
			await animate(
				textRef.current!,
				{
					top: targetTop,
					fontSize: fontSize,
				},
				{ duration: 0.8, ease: [0.76, 0, 0.24, 1] },
			)

			// fade out overlay
			await animate(
				overlayRef.current!,
				{
					backgroundColor: 'rgba(0,0,0,0)',
				},
				{ duration: 0.6, ease: 'easeInOut' },
			)

			setDone(true)
		}

		sequence()
	}, [])

	return (
		<>
			<h1 ref={h1Ref} className="text-center text-4xl" style={{ opacity: done ? 1 : 0 }}>
				{label}
			</h1>

			{!done && (
				<div
					ref={overlayRef}
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 9999,
						pointerEvents: 'none',
						backgroundColor: 'rgba(0,0,0,1)',
					}}
				>
					<h1
						ref={textRef}
						style={{
							position: 'fixed',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							fontSize: '6rem',
							color: 'white',
							margin: 0,
							whiteSpace: 'nowrap',
						}}
					>
						{label}
					</h1>
				</div>
			)}
		</>
	)
}
