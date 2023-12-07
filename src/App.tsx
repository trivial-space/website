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

			<footer class="fixed bottom-0 flex w-full flex-wrap items-center gap-2 p-2 text-xs text-gray-700 md:p-4 md:text-base">
				<span class="whitespace-nowrap">
					Made with 🖤 by <a href="https://trival.xyz">Thomas Gorny</a>
				</span>
				<span class="flex-grow" />
				<a href="https://github.com/trivial-space" class="whitespace-nowrap">
					Open source &nbsp;
					<svg
						class="inline-block h-4 w-4 fill-current align-top md:h-5 md:w-5"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 16 16"
					>
						<title>github</title>
						<path d="M8 0.198c-4.418 0-8 3.582-8 8 0 3.535 2.292 6.533 5.471 7.591 0.4 0.074 0.547-0.174 0.547-0.385 0-0.191-0.008-0.821-0.011-1.489-2.226 0.484-2.695-0.944-2.695-0.944-0.364-0.925-0.888-1.171-0.888-1.171-0.726-0.497 0.055-0.486 0.055-0.486 0.803 0.056 1.226 0.824 1.226 0.824 0.714 1.223 1.872 0.869 2.328 0.665 0.072-0.517 0.279-0.87 0.508-1.070-1.777-0.202-3.645-0.888-3.645-3.954 0-0.873 0.313-1.587 0.824-2.147-0.083-0.202-0.357-1.015 0.077-2.117 0 0 0.672-0.215 2.201 0.82 0.638-0.177 1.322-0.266 2.002-0.269 0.68 0.003 1.365 0.092 2.004 0.269 1.527-1.035 2.198-0.82 2.198-0.82 0.435 1.102 0.162 1.916 0.079 2.117 0.513 0.56 0.823 1.274 0.823 2.147 0 3.073-1.872 3.749-3.653 3.947 0.287 0.248 0.543 0.735 0.543 1.481 0 1.070-0.009 1.932-0.009 2.195 0 0.213 0.144 0.462 0.55 0.384 3.177-1.059 5.466-4.057 5.466-7.59 0-4.418-3.582-8-8-8z" />
					</svg>{' '}
				</a>
			</footer>
		</div>
	)
}

export default App
