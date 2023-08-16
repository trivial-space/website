import { For, onMount } from 'solid-js'
import { useParams } from '@solidjs/router'
import Work from './Work'
import { data } from './data/data'
import { animate, scroll } from 'motion'

export default function Gallery() {
	const params = useParams()
	let galleryEl: HTMLDivElement
	console.log(params)

	onMount(() => {
		let works = document.querySelectorAll('.work-link')
		works.forEach((work) => {
			scroll(
				animate(work, {
					rotateY: [-25, 25],
					scale: [1.25, 1.05, 1, 1.05, 1.25],
					translate: ['20%', '8%', '0%', '-8%', '-20%'],
				}),
				{
					target: work,
					container: galleryEl,
					axis: 'x',
					// offset: ['end start', 'start end'],
					offset: ['start end', 'end start'],
				},
			)
		})
	})

	return (
		<div
			class={`h-full flex flex-nowrap overflow-x-auto items-center px-[25vw] transition-transform`}
			ref={galleryEl}
		>
			<For each={data.sketches}>
				{(sketch) => {
					return (
						<Work
							img={sketch.img}
							title={sketch.slug}
							slug={sketch.slug}
							active={sketch.slug === params.id}
						/>
					)
				}}
			</For>
		</div>
	)
}
