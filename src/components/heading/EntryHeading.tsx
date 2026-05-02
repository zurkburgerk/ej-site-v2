'use client'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'
import { ExpandingNavButton } from '../buttons/ExpandingNavButton'

const DURATION = 3
const TIMES = [0, 0.75, 1]

export function EntryHeading({ label }: { label: string }) {
	const [ready, setReady] = useState(false)
	const [isFirstVisit, setIsFirstVisit] = useState(false)
	const [clicked, setClicked] = useState(false)
	const [width, setWidth] = useState(0)

	useLayoutEffect(() => {
		const w = window.innerWidth
		setWidth(w)
		const animated = sessionStorage.getItem('entryHeadingAnimated')
		sessionStorage.setItem('entryHeadingAnimated', 'true')
		setIsFirstVisit(!animated)
		setReady(true)
	}, [])

	const nav = (
		<div className="col-span-4 flex flex-row gap-4 pl-2">
			<ExpandingNavButton label="PROJECTS" href="/projects" />
			<ExpandingNavButton label="ABOUT" href="/about" />
			<ExpandingNavButton label="CONTACT" href="/contact" />
		</div>
	)

	if (!ready) {
		return (
			<>
				<div className="grid grid-cols-12 py-2">
					{nav}
					<div className="relative col-span-8 z-1001">
						<div className="relative text-xl w-fit ml-auto mr-2 opacity-0">
							<Link href="/">
								<h1>{label}</h1>
							</Link>
						</div>
					</div>
				</div>
				<div className="ml-auto mr-0 h-[1px] w-2/3 bg-black" />
			</>
		)
	}

	return (
		<>
			<div className="grid grid-cols-12 py-2">
				{nav}
				<div className="relative col-span-8 z-1001">
					<motion.div
						className="relative text-xl z-1001 w-fit ml-auto mr-2"
						initial={isFirstVisit ? { x: -width, color: '#fff' } : { x: 0, color: '#000' }}
						animate={
							isFirstVisit
								? clicked
									? { x: [-width, 0, 0], color: ['#fff', '#fff', '#000'] }
									: { x: -width, color: '#fff' }
								: { x: 0, color: '#000' }
						}
						transition={
							isFirstVisit
								? { delay: 2, duration: DURATION, times: TIMES, ease: 'circOut' }
								: { duration: 0 }
						}
					>
						<Link href="/">
							<h1 className="hover:text-orange-500 transition-colors duration-300">{label}</h1>
						</Link>
					</motion.div>
				</div>
			</div>

			<div className="ml-auto mr-0 h-[1px] w-2/3 bg-black" />

			{isFirstVisit && (
				<>
					{/* Orange overlay */}
					<motion.div
						style={{
							position: 'fixed',
							inset: 0,
							zIndex: 999,
							backgroundColor: 'var(--color-orange-500)',
							cursor: 'pointer',
							pointerEvents: clicked ? 'none' : 'auto',
						}}
						animate={{ opacity: clicked ? [1, 1, 0] : 1 }}
						transition={{ delay: 3, duration: DURATION, times: TIMES, ease: 'easeOut' }}
						onClick={() => setClicked(true)}
					/>

					{/* Heading underline */}
					<motion.div
						className="ml-auto mr-0 h-[1px] bg-white z-999"
						initial={{ width: '0%', opacity: 1, y: -1 }}
						animate={clicked ? { width: ['0%', '66.6666%', '66.6666%'], opacity: [1, 1, 0] } : {}}
						transition={{ delay: 2, duration: DURATION, times: TIMES, ease: 'circOut' }}
					/>

					{/* Logo */}
					<motion.svg
						width="100%"
						height="100%"
						style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'none' }}
						viewBox="-500 -500 1000 1000"
						preserveAspectRatio="xMidYMid meet"
						animate={{ opacity: clicked ? [1, 1, 0] : 1 }}
						transition={{ duration: DURATION, times: TIMES, ease: 'linear' }}
					>
						<motion.path
							d="M-25 0 L25 0 L-25 0 L-25 50 L25 50 L-25 50 L-25 100 L25 100 L25 200 L-25 200 L-25 175"
							style={{ fill: 'none', stroke: 'white', strokeWidth: 4 }}
							initial={{ pathLength: 0 }}
							animate={clicked ? { pathLength: 0 } : { pathLength: 1 }}
							transition={{ duration: 1.5, ease: 'easeOut' }}
						/>
						<motion.path
							d="M-25 0 L1000 0"
							style={{ fill: 'none', stroke: 'white', strokeWidth: 4 }}
							initial={{ pathLength: 0, pathOffset: 0 }}
							animate={
								clicked ? { pathLength: [0, 0, 1, 1], pathOffset: [0, 0, 0, 1] } : { pathLength: 0 }
							}
							transition={{ duration: 3, times: [0, 0.25, 0.5, 1], ease: 'easeIn' }}
						/>
					</motion.svg>
				</>
			)}
		</>
	)
}
