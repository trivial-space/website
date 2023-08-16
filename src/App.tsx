import type { Component } from 'solid-js'
import Gallery from './Gallery'
import { Route, Routes, useNavigate } from '@solidjs/router'

const App: Component = () => {
	const navigate = useNavigate()
	return (
		<div
			class="h-full flex flex-col"
			onClick={(e) => {
				if (!e.target.classList.contains('work-link')) {
					navigate('/')
				}
			}}
		>
			<header class="">
				<h1 class=" m-4 text-4xl uppercase font-extralight tracking-widest">
					trivial space
				</h1>
			</header>

			<main class="flex-grow">
				<Routes>
					<Route path="/:id?" element={<Gallery />} />
				</Routes>
			</main>

			<footer class="m-4">
				Made with 🖤 by <a href="https://trival.xyz">Thomas Gorny</a>
			</footer>
		</div>
	)
}

export default App
