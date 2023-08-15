import { PropsWithChildren } from 'react'
import '../styles/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'trivial space',
}

export default function Layout({ children }: PropsWithChildren) {
	return (
		<html>
			<head>
				<link
					rel="stylesheet"
					href="https://code.cdn.mozilla.net/fonts/fira.css"
				/>
				<link rel="icon" href="/favicon.ico" />
			</head>

			<body>
				<div className="h-full flex flex-col">
					<header className="">
						<h1 className=" m-4 text-4xl uppercase font-extralight tracking-widest">
							trivial space
						</h1>
					</header>

					<main className="flex-grow">{children}</main>

					<footer className="m-4">
						Made with 🖤 by <a href="https://trival.xyz">Thomas Gorny</a>
					</footer>
				</div>
			</body>
		</html>
	)
}
