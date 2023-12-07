import type { Component } from 'solid-js'
import Gallery from './Gallery'
import { Route, Routes, useNavigate } from '@solidjs/router'

const App: Component = () => {
	const navigate = useNavigate()
	return (
		<div
			class="h-full w-full"
			onPointerDown={(e) => {
				if (
					!e.target.classList.contains('work-link') &&
					!e.target.closest('.work-link')
				) {
					navigate('/', { replace: true })
				}
			}}
		>
			<header class="fixed top-0">
				<h1 class="m-2 mb-0 md:m-4 text-2xl md:text-4xl uppercase font-extralight tracking-widest">
					trivial space
				</h1>
			</header>

			<main class="w-full h-full">
				<Routes>
					<Route path="/:id?" element={<Gallery />} />
				</Routes>
			</main>

			<footer class="m-2 md:text-base text-gray-700 text-xs md:m-4 fixed bottom-0">
				Made with 🖤 by <a href="https://trival.xyz">Thomas Gorny</a>
			</footer>
		</div>
	)
}

export default App
