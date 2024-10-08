import { useParams } from '@solidjs/router'
import { animate, scroll } from 'motion'
import {
	For,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
} from 'solid-js'
import { useState } from './State'
import Work from './Work'
import { data } from './data/data'

export default function Gallery() {
	const params = useParams()
	let galleryEl: HTMLDivElement

	const workId = createMemo(() => params.id)
	const state = useState()
	const [lockScroll, setLockScroll] = createSignal(false)

	let lockScrollTimeout: number

	const scrollToSelected =
		(smooth = true) =>
		// eslint-disable-next-line solid/reactivity
		() => {
			let activeWork = document.querySelector(`[data-id="${workId()}"]`)
			clearTimeout(lockScrollTimeout)
			setLockScroll(false)

			if (activeWork && galleryEl) {
				const bound = activeWork.getBoundingClientRect()
				const width = state.window.width
				const leftDelta = width / 2 - bound.left - bound.width / 2

				// console.log(bound, leftDelta, width)

				galleryEl.scrollTo({
					left: galleryEl.scrollLeft - leftDelta,
					behavior: smooth ? 'smooth' : undefined,
				})

				lockScrollTimeout = setTimeout(() => {
					setLockScroll(true)
				}, 1000)
			}
		}

	createEffect(scrollToSelected())

	const initTimeout = setTimeout(scrollToSelected(false), 700)

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
						scale: [1.5, 1.2, 1.05, 1, 1.05, 1.2, 1.5],
						translate: ['60%', '15%', '2%', '0%', '-2%', '-15%', '-60%'],
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
			class="gallery flex h-full flex-nowrap items-center overflow-x-auto overflow-y-hidden px-[30vw] pb-[8vh] transition-transform"
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
							url={sketch.href}
							background={sketch.background}
						/>
					)
				}}
			</For>
		</div>
	)
}
