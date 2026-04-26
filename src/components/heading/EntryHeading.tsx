'use client'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useState } from 'react'

export function EntryHeading({ label }: { label: string }) {
	const [hasAnimated, setHasAnimated] = useState(true) // server + client agree: no animation
	const [width, setWidth] = useState(0)

	useLayoutEffect(() => {
		setWidth(window.innerWidth)
		const animated = sessionStorage.getItem('entryHeadingAnimated')
		sessionStorage.setItem('entryHeadingAnimated', 'true')
		if (!animated) {
			setHasAnimated(false) // first visit only: triggers animation before paint
		}
	}, [])

	return (
		<>
			<div className="grid grid-cols-12 pt-8 pb-8">
				<div className="col-span-6 sm:col-span-9" />
				<div className="col-span-6 sm:col-span-3" style={{ zIndex: 1001, position: 'relative' }}>
					<Link href="/">
						<motion.h1
							className="text-4xl text-center"
							style={{ zIndex: 1001, position: 'relative' }}
							animate={{
								translateX: hasAnimated ? 0 : [-width, 0, 0],
								color: hasAnimated ? '#000' : ['#fff', '#fff', '#000'],
							}}
							transition={
								hasAnimated
									? { duration: 0 }
									: { duration: 4, times: [0, 0.25, 0.5, 1], ease: 'circOut' }
							}
						>
							{label}
						</motion.h1>
					</Link>
				</div>
			</div>
			<div className="ml-auto mr-0 h-[2px] w-2/3 bg-black" />

			{!hasAnimated && (
				<motion.div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 999,
						pointerEvents: 'none',
						backgroundColor: 'rgba(0,0,0,1)',
					}}
					animate={{ opacity: 0 }}
					transition={{ delay: 2, duration: 2, type: 'spring' }}
				/>
			)}
		</>
	)
}
