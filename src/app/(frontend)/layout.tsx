import React from 'react'
import { Pathway_Gothic_One } from 'next/font/google'
import './styles.css'
import { TransitionProvider } from '@/components/transition/TransitionProvider'

export const metadata = {
	description: 'A blank template using Payload in a Next.js app.',
	title: 'Payload Blank Template',
}

const nunito = Pathway_Gothic_One({ weight: ['400'], variable: '--font-main' })

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
