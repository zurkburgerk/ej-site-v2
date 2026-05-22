'use client'
import { animate, motion, stagger, Variants } from 'motion/react'
import React, { JSX, ReactNode, useState } from 'react'

export type HeadingMenuProps = {
	children?: ReactNode
}

export function HeadingMenu({ children }: HeadingMenuProps) {
	const [isOpen, setIsOpen] = useState(false)

	const menuVariants: Variants = {
		open: {
			opacity: 1,
			visibility: 'visible',
			boxShadow: '15px 0 10px 0px white',
			transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) },
		},
		closed: {
			opacity: 0,
			visibility: 'hidden',
			transition: { delayChildren: stagger(0.05, { from: 'last' }) },
		},
	}

	const menuItemVariants: Variants = {
		open: {
			opacity: 1,
			x: 0,
			visibility: 'visible',
		},
		closed: {
			opacity: 0,
			x: -8,
			visibility: 'hidden',
		},
	}

	return (
		<motion.div className="flex flex-row gap-4 pl-2">
			<MenuToggle onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
			<motion.div
				className="flex flex-row gap-4 bg-white z-2000"
				animate={isOpen ? 'open' : 'closed'}
				initial="closed"
				variants={menuVariants}
			>
				{React.Children.map(children, (child, index) => {
					return (
						<motion.div key={index} variants={menuItemVariants} className="cursor-pointer">
							{child}
						</motion.div>
					)
				})}
			</motion.div>
		</motion.div>
	)
}

const MenuToggle = ({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => {
	return (
		<button onClick={onClick}>
			<motion.svg width={25} height={25} viewBox="-10 -10 20 20">
				{/* top line - top-left to bottom-right diagonal */}
				<motion.path
					style={{ fill: 'none', stroke: 'black', strokeWidth: 1 }}
					animate={isOpen ? { d: 'M-6 -6 L6 6' } : { d: 'M-6 -9 L10 -9' }}
					transition={{ duration: 0.3 }}
				/>
				{/* middle line - fade out */}
				<motion.path
					style={{ fill: 'none', stroke: 'black', strokeWidth: 1 }}
					d="M-6 0 L6 0"
					animate={{ opacity: isOpen ? 0 : 1 }}
					transition={{ duration: 0.15 }}
				/>
				{/* bottom line - top-right to bottom-left diagonal */}
				<motion.path
					style={{ fill: 'none', stroke: 'black', strokeWidth: 1 }}
					animate={isOpen ? { d: 'M-6 6 L6 -6' } : { d: 'M-10 9 L6 9' }}
					transition={{ duration: 0.3 }}
				/>
			</motion.svg>
		</button>
	)
}
