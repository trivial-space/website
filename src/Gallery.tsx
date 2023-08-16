import { For, createEffect, createMemo, onMount } from 'solid-js'
import { useParams } from '@solidjs/router'
import Work from './Work'
import { data } from './data/data'
import { animate, scroll } from 'motion'

export default function Gallery() {
	const params = useParams()
	let galleryEl: HTMLDivElement

	const workId = createMemo(() => params.id)

	const scrollToActiveWork = () => {
		let activeWork = document.querySelector(`[data-id="${workId()}"]`)

		if (activeWork) {
			const bound = activeWork.getBoundingClientRect()
			const width = window.innerWidth
			const leftDelta = width / 2 - bound.left - bound.width / 2

			console.log(bound, leftDelta, width)

			galleryEl.scrollTo({
				left: galleryEl.scrollLeft - leftDelta,
				behavior: 'smooth',
			})
		}
	}

	createEffect(scrollToActiveWork)

	onMount(() => {
		let works = document.querySelectorAll('.work-link')

		if (typeof (window as any).ScrollTimeline !== 'undefined') {
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
						offset: ['start end', 'end start'],
					},
				)
			})
		}

		scrollToActiveWork()
	})

	return (
		<div
			class="h-full flex flex-nowrap overflow-x-auto overflow-y-hidden items-center px-[20vw] transition-transform"
			classList={{ ['!overflow-hidden']: !!workId() }}
			ref={galleryEl}
		>
			<For each={data.sketches}>
				{(sketch) => {
					return (
						<Work
							img={sketch.img}
							slug={sketch.slug}
							active={sketch.slug === workId()}
							width={sketch.width}
							height={sketch.height}
						/>
					)
				}}
			</For>
		</div>
	)
}
