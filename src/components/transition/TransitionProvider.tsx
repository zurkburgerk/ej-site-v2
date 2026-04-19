'use client'
import { createContext, useContext, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'

type TransitionContextType = {
	transitionTo: (href: string, rect: DOMRect, label: string) => void
}

const TransitionContext = createContext<TransitionContextType>({ transitionTo: () => {} })

export function useTransition() {
	return useContext(TransitionContext)
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const [overlay, setOverlay] = useState<{
		rect: DOMRect
		label: string
		phase: 'expand' | 'fadeout'
	} | null>(null)

	const transitionTo = (href: string, rect: DOMRect, label: string) => {
		setOverlay({ rect, label, phase: 'expand' })

		// Once expanded, navigate
		setTimeout(() => {
			router.push(href)
			// Give the new page a moment to mount, then fade out
			setTimeout(() => {
				setOverlay((prev) => (prev ? { ...prev, phase: 'fadeout' } : null))
				setTimeout(() => setOverlay(null), 600)
			}, 300)
		}, 500)
	}

	return (
		<TransitionContext.Provider value={{ transitionTo }}>
			{children}
			<AnimatePresence>
				{overlay && (
					<motion.div
						key="overlay"
						initial={{
							position: 'fixed',
							left: overlay.rect.left,
							top: overlay.rect.top,
							width: overlay.rect.width,
							height: overlay.rect.height,
							opacity: 1,
							zIndex: 9999,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: '#ff6900',
							color: 'white',
						}}
						animate={
							overlay.phase === 'expand'
								? {
										left: 0,
										top: 0,
										width: '100vw',
										height: '100vh',
										opacity: 1,
									}
								: {
										left: 0,
										top: 0,
										width: '100vw',
										height: '100vh',
										opacity: 0,
									}
						}
						transition={
							overlay.phase === 'expand'
								? {
										duration: 0.5,
										ease: [0.76, 0, 0.24, 1],
									}
								: {
										duration: 0.6,
										ease: 'easeInOut',
									}
						}
					>
						<motion.p
							initial={{ fontSize: '1.25rem' }}
							animate={
								overlay.phase === 'expand' ? { fontSize: '4rem' } : { fontSize: '4rem', opacity: 0 }
							}
							transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
						>
							{overlay.label}
						</motion.p>
					</motion.div>
				)}
			</AnimatePresence>
		</TransitionContext.Provider>
	)
}
