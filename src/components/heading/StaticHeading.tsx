import Link from 'next/link'
import { HeadingMenu } from './HeadingMenu'
import { ExpandingNavButton } from '../buttons/ExpandingNavButton'

export function StaticHeading({ label }: { label: string }) {
	return (
		<>
			<div className="grid grid-cols-12 py-2">
				<div className="col-span-4">
					<HeadingMenu>
						<ExpandingNavButton label="PROJECTS" href="/projects" />
						<ExpandingNavButton label="ABOUT" href="/about" />
						<ExpandingNavButton label="CONTACT" href="/contact" />
					</HeadingMenu>
				</div>
				<div className="relative z-20 col-span-8">
					<Link href="/">
						<h1 className="relative text-xl text-right pr-2 relative z-1001 hover:text-orange-500 transition-colors duration-300">
							{label}
						</h1>
					</Link>
				</div>
			</div>
			<div className="ml-auto mr-0 h-[1px] w-2/3 bg-black" />
		</>
	)
}
