import {
	For,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
} from 'solid-js'
import { useParams } from '@solidjs/router'
import Work from './Work'
import { data } from './data/data'
import { animate, scroll } from 'motion'
import { useState } from './State'

export default function Gallery() {
	const params = useParams()
	let galleryEl: HTMLDivElement

	const workId = createMemo(() => params.id)
	const state = useState()
	const [lockScroll, setLockScroll] = createSignal(false)
	let lockScrollTimeout: number

	const scrollToSelected = () => {
		let activeWork = document.querySelector(`[data-id="${workId()}"]`)
		clearTimeout(lockScrollTimeout)
		setLockScroll(false)

		if (activeWork && galleryEl) {
			const bound = activeWork.getBoundingClientRect()
			const width = state.window.width
			const leftDelta = width / 2 - bound.left - bound.width / 2

			console.log(bound, leftDelta, width)

			galleryEl.scrollTo({
				left: galleryEl.scrollLeft - leftDelta,
				behavior: 'smooth',
			})

			lockScrollTimeout = setTimeout(() => {
				setLockScroll(true)
			}, 2000)
		}
	}

	createEffect(scrollToSelected)

	const initTimeout = setTimeout(scrollToSelected, 1000)

	onCleanup(() => {
		clearTimeout(initTimeout)
		clearTimeout(lockScrollTimeout)
	})

	onMount(() => {
		let works = document.querySelectorAll('.work-link')

		if (typeof (window as any).ScrollTimeline !== 'undefined') {
			works.forEach((work) => {
				scroll(
					animate(work, {
						rotateY: [-25, 25],
						scale: [1.35, 1.15, 1.05, 1, 1.05, 1.15, 1.35],
						translate: ['20%', '8%', '2%', '0%', '-2%', '-8%', '-20%'],
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
	})

	return (
		<div
			class="h-full flex flex-nowrap overflow-x-auto overflow-y-hidden items-center px-[30vw] transition-transform pb-[8vh]"
			classList={{ ['!overflow-hidden']: !!workId() && lockScroll() }}
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
