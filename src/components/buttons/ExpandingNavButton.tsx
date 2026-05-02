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
			className="p-1 border-solid border-1 border-black hover:border-orange-500 hover:text-orange-500 hover:shadow-[8px_8px_rgba(0,0,0,0.2)] transition-all duration-300 flex items-center justify-center"
		>
			<p className="text-xs">{label}</p>
		</div>
	)
}
