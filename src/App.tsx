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
				<h1 class="m-2 mb-0 text-2xl font-extralight uppercase tracking-widest md:m-4 md:text-4xl">
					trivial space
				</h1>
			</header>

			<main class="h-full w-full">
				<Routes>
					<Route path="/:id?" element={<Gallery />} />
				</Routes>
			</main>

			<footer class="fixed bottom-0 m-2 text-xs text-gray-700 md:m-4 md:text-base">
				Made with 🖤 by <a href="https://trival.xyz">Thomas Gorny</a>
			</footer>
		</div>
	)
}

export default App
