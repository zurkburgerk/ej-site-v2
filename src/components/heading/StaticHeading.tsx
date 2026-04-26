import Link from 'next/link'

export function StaticHeading({ label }: { label: string }) {
	return (
		<>
			<div className="grid grid-cols-12 pt-8 pb-8">
				<div className="col-span-6 sm:col-span-9" />
				<div className="relative z-20 col-span-6 sm:col-span-3">
					<Link href="/">
						<h1
							className="relative text-4xl text-center"
							style={{ zIndex: 1001, position: 'relative' }}
						>
							{label}
						</h1>
					</Link>
				</div>
			</div>
			<div className="ml-auto mr-0 h-[2px] w-2/3 bg-black" />
		</>
	)
}
