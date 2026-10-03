import { useParams } from '@solidjs/router'
import {
	For,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
} from 'solid-js'
import {
	Cylinder,
	createCylinder,
	cylinderTransform,
	panelRange,
} from './cylinder'
import { data } from './data/data'
import { useState } from './State'
import Work, { browseScale } from './Work'

// offset of the first / last work from the center at the scroll ends,
// as fraction of half the viewport width (1 = at the screen edge)
const endWorkOffset = 0.3

// works are posed by scroll-driven animations on a ViewTimeline. on resize their
// keyframes are updated in place, so they never restart. keyframes are plain
// values, so browsers can run them off the main thread.
// without support (firefox), works are posed on scroll instead
const nativeScrollTimeline = typeof ViewTimeline !== 'undefined'

export default function Gallery() {
	const params = useParams()
	let galleryEl!: HTMLDivElement
	let startSpacer!: HTMLDivElement
	let endSpacer!: HTMLDivElement

	const workId = createMemo(() => params.id)
	const state = useState()
	const [lockScroll, setLockScroll] = createSignal(false)

	let lockScrollTimeout: number

	const scrollToSelected =
		(smooth = true) =>
		() => {
			let activeWork = galleryEl?.querySelector<HTMLElement>(
				`[data-id="${workId()}"]`,
			)
			clearTimeout(lockScrollTimeout)
			setLockScroll(false)

			if (activeWork && galleryEl) {
				// layout position, the bounding rect includes the cylinder projection
				const center = activeWork.offsetLeft + activeWork.offsetWidth / 2

				galleryEl.scrollTo({
					left: center - state.window.width / 2,
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
		let cylinder: Cylinder | undefined
		let panels: { el: HTMLElement; center: number; exit: number }[] = []
		const animations = new Map<HTMLElement, Animation>()

		const update = () => {
			const works = [...galleryEl.querySelectorAll<HTMLElement>('[data-id]')]
			const viewWidth = galleryEl.clientWidth
			if (!works.length || !viewWidth) return

			// at the scroll ends, the first / last work rests off center, slightly
			// rotated, hinting the scroll direction. every work can still be centered
			// spacers instead of padding, which would widen the gallery itself
			// while the works are not yet sized
			const endSpace = (work: HTMLElement) =>
				`${Math.max(0, ((1 + endWorkOffset) * viewWidth) / 2 - work.offsetWidth / 2)}px`
			startSpacer.style.width = endSpace(works[0])
			endSpacer.style.width = endSpace(works[works.length - 1])

			const visualWidth = (work: HTMLElement) =>
				work.querySelector<HTMLElement>('.work-link')!.offsetWidth * browseScale

			const c = createCylinder(
				viewWidth,
				galleryEl.clientHeight,
				Math.max(...works.map(visualWidth)),
			)
			cylinder = c

			panels = works.map((el) => {
				const { exit, travel } = panelRange(c, visualWidth(el), el.offsetWidth)
				if (nativeScrollTimeline) {
					// hold the poses outside the visible range. offsets are progress
					// through the 'cover' range, from entering to leaving the viewport
					const visibleFrom = 0.5 - (0.5 * exit) / travel
					const enter = cylinderTransform(c, exit)
					const leave = cylinderTransform(c, -exit)
					const keyframes = [
						{ transform: enter, offset: 0 },
						{ transform: enter, offset: visibleFrom },
						{ transform: leave, offset: 1 - visibleFrom },
						{ transform: leave, offset: 1 },
					]
					const animation = animations.get(el)
					if (animation) {
						;(animation.effect as KeyframeEffect).setKeyframes(keyframes)
					} else {
						animations.set(
							el,
							el.animate(keyframes, {
								fill: 'both',
								easing: 'linear',
								timeline: new ViewTimeline({ subject: el, axis: 'inline' }),
							}),
						)
					}
				}
				return { el, center: el.offsetLeft + el.offsetWidth / 2, exit }
			})

			if (!nativeScrollTimeline) pose()
		}

		const pose = () => {
			if (!cylinder) return
			const viewCenter = galleryEl.scrollLeft + galleryEl.clientWidth / 2
			for (const { el, center, exit } of panels) {
				const s = Math.max(-exit, Math.min(exit, center - viewCenter))
				el.style.transform = cylinderTransform(cylinder, s)
			}
		}

		// runs after layout, before paint, so poses never lag behind a resize
		const observer = new ResizeObserver(update)
		observer.observe(galleryEl, { box: 'border-box' })
		galleryEl
			.querySelectorAll('[data-id]')
			.forEach((work) => observer.observe(work))

		if (!nativeScrollTimeline) {
			galleryEl.addEventListener('scroll', pose, { passive: true })
		}

		onCleanup(() => {
			observer.disconnect()
			galleryEl.removeEventListener('scroll', pose)
			animations.forEach((animation) => animation.cancel())
		})
	})

	return (
		<div
			class="gallery relative flex h-full flex-nowrap items-center overflow-x-auto overflow-y-hidden pb-[8vh] transition-transform"
			classList={{ ['overflow-hidden!']: !!workId() && lockScroll() }}
			ref={galleryEl}
		>
			{/* clips horizontally, so the projected works never extend the scroll range */}
			<div class="flex shrink-0 items-center self-stretch overflow-x-clip">
				<div class="h-px shrink-0" ref={startSpacer} />
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
				<div class="h-px shrink-0" ref={endSpacer} />
			</div>
		</div>
	)
}
