import type { Component } from 'solid-js'
import Gallery from './Gallery'
import { Route, Routes, useNavigate } from '@solidjs/router'

const App: Component = () => {
	const navigate = useNavigate()
	return (
		<div
			class="h-full max-h-full flex flex-col"
			onPointerDown={(e) => {
				if (
					!e.target.classList.contains('work-link') &&
					!e.target.closest('.work-link')
				) {
					navigate('/')
				}
			}}
		>
			<header class="">
				<h1 class="m-2 md:m-4 text-2xl md:text-4xl uppercase font-extralight tracking-widest">
					trivial space
				</h1>
			</header>

			<main class="flex-grow flex-shrink">
				<Routes>
					<Route path="/:id?" element={<Gallery />} />
				</Routes>
			</main>

			<footer class="m-2 md:text-base text-xs md:m-4 fixed bottom-0">
				Made with 🖤 by <a href="https://trival.xyz">Thomas Gorny</a>
			</footer>
		</div>
	)
}

export default App
