'use client'
import { useRef } from 'react'
import { useTransition } from '@/components/transition/TransitionProvider'

export function ExpandingNavButton({ label, href }: { label: string; href: string }) {
	const buttonRef = useRef<HTMLDivElement>(null)
	const { transitionTo } = useTransition()

	const handleClick = () => {
		if (!buttonRef.current) return
		const rect = buttonRef.current.getBoundingClientRect()
		transitionTo(href, rect, label)
	}

	return (
		<div
			ref={buttonRef}
			onClick={handleClick}
			className="aspect-square max-h-25 w-25 border-solid border-2 border-black hover:border-orange-500 hover:shadow-[8px_8px_rgba(0,0,0,0.2)] transition-all duration-300 flex items-center justify-center"
		>
			<p className="text-xl">{label}</p>
		</div>
	)
}
