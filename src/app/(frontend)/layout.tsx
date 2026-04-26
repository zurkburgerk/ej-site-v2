import React from 'react'
import { Hanken_Grotesk } from 'next/font/google'
import './styles.css'
import { TransitionProvider } from '@/components/transition/TransitionProvider'

export const metadata = {
	description: 'An architectural portforlio of work by Emon Johnson.',
	title: 'Portfolio | Emon Johnson',
}

const nunito = Hanken_Grotesk({ weight: ['400'], variable: '--font-main' })

export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props

	return (
		<html lang="en" className={`${nunito.variable}`}>
			<body>
				<TransitionProvider>
					<main>{children}</main>
				</TransitionProvider>
			</body>
		</html>
	)
}
