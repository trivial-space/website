import { A, useParams } from '@solidjs/router'
import { debounce } from 'lodash'
import { Icon } from 'solid-heroicons'
import { arrowsPointingOut, xMark } from 'solid-heroicons/outline'
import { arrowPath } from 'solid-heroicons/solid'
import {
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
	Show,
} from 'solid-js'
import { createReflection } from './reflection'
import { useState } from './State'
import { createPresence } from './utils'

interface Props {
	img: string
	slug: string
	active: boolean
	width: number
	height: number
	url: string
	background: string
}

export const browseScale = 0.6
// gap between works, relative to the browsing size of the smaller max dimension
const gapFactor = 0.7

const maxSizeBig = 1100
const maxSizeWidthFactor = 0.98
const maxSizeHeightFactor = 0.87

export default function Work(props: Props) {
	const state = useState()
	const params = useParams()

	const [openNav, setOpenNav] = createSignal(false)
	const [isTop, setIsTop] = createSignal(false)
	const [isPlaying, setIsPlaying] = createSignal(false)

	const aspectRatio = createMemo(() => props.width / props.height)

	const maxSize = createMemo(() => ({
		width: Math.min(state.window.width * maxSizeWidthFactor, maxSizeBig),
		height: Math.min(state.window.height * maxSizeHeightFactor, maxSizeBig),
	}))

	const size = (open: boolean) => {
		const { width: maxWidth, height: maxHeight } = maxSize()

		let height = 0
		let width = 0

		width = maxWidth

		if (width < maxSizeBig && open) {
			height = maxHeight
		} else {
			height = maxWidth / aspectRatio()
			if (height > maxHeight) {
				height = maxHeight
				width = height * aspectRatio()
			}
		}

		return { width: Math.floor(width), height: Math.floor(height) }
	}

	const dimensions = createMemo(() => size(openNav()))

	// the layout slot is the browsing size plus a gap scaled with the gallery,
	// so the spacing keeps its proportion on every screen. it never changes when
	// opening, so the work stays centered on the cylinder and overflows evenly
	const slotWidth = createMemo(() => {
		const { width, height } = maxSize()
		const gap = gapFactor * browseScale * Math.min(width, height)
		return browseScale * size(false).width + gap
	})

	const [reflection, setReflection] = createSignal<string>()
	onMount(() => {
		createReflection(props.img, props.background).then(
			setReflection,
			console.error,
		)
	})
	onCleanup(() => {
		const url = reflection()
		if (url) URL.revokeObjectURL(url)
	})

	const overlay = createPresence(isPlaying, 1600)
	const sketch = createPresence(isPlaying, 500)

	let iframe: HTMLIFrameElement | undefined

	let timeout: number
	createEffect(() => {
		clearTimeout(timeout)
		if (props.active) {
			setIsTop(true)
			setIsPlaying(true)
			timeout = setTimeout(() => {
				setOpenNav(true)
			}, 300)
		} else {
			setOpenNav(false)
			requestAnimationFrame(() => {
				setIsPlaying(false)
			})
			if (params.id) {
				setIsTop(false)
			} else {
				timeout = setTimeout(() => {
					setIsTop(false)
				}, 300)
			}
		}
	})

	function refresh() {
		if (props.active && iframe) {
			// eslint-disable-next-line no-self-assign
			iframe.src = iframe.src
		}
	}

	const debouncedFocus = debounce(() => {
		if (iframe) {
			iframe.focus()
			iframe.contentWindow?.focus()
		}
	}, 100)

	return (
		<>
			<Show when={overlay.mounted()}>
				<div
					class="pointer-events-none fixed inset-0 z-40 h-full w-full bg-slate-800 transition-opacity duration-1600"
					classList={{
						'opacity-60': overlay.shown(),
						'opacity-0': !overlay.shown(),
					}}
				/>
			</Show>
			<div
				data-id={props.slug}
				class="relative -mt-8 will-change-transform"
				classList={{
					['z-0']: !isTop(),
					['z-50']: isTop(),
				}}
			>
				<div
					class="work-link relative z-50 my-auto block origin-center rounded-md bg-white object-contain shadow-2xl shadow-slate-600/40 delay-200 duration-500 ease-in-out"
					classList={{
						'translate-y-[5vh]': isTop(),
						'blur-[2px] md:blur-[3px]': !props.active && !params.id,
						'blur-[8px] md:blur-[10px]': !props.active && !!params.id,
					}}
					style={{
						width: dimensions().width + 'px',
						height: dimensions().height + 'px',
						'margin-inline': (slotWidth() - dimensions().width) / 2 + 'px',
						scale: isTop() ? 1 : browseScale,
					}}
				>
					<A href="/" class="absolute -top-6 right-0 opacity-50 md:-top-7">
						<Icon path={xMark} class="size-5 text-white" />
					</A>
					<div
						class="relative h-full w-full rounded-md border-4"
						classList={{
							'shadow-xl shadow-slate-900/35': openNav(),
						}}
						style={{
							'background-color': props.background,
							'border-color': props.background,
						}}
					>
						{/* cross fade: the thumbnail fades out before the sketch fades in, and back */}
						<div
							class="h-full w-full transition-opacity duration-500"
							classList={{
								'opacity-0': isPlaying(),
								'delay-800': !isPlaying(),
							}}
						>
							<A href={`/${props.slug}`} replace>
								<img
									alt={props.slug}
									src={props.img}
									class="h-full w-full object-contain"
									width={props.width}
									height={props.height}
								/>
							</A>
						</div>
						<Show when={sketch.mounted()}>
							<iframe
								ref={iframe}
								class="absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-500"
								classList={{
									'opacity-0': !sketch.shown(),
									'delay-1500': sketch.shown() && props.active,
									'delay-1000': sketch.shown() && !props.active,
								}}
								src={props.url}
								width={dimensions().width}
								height={dimensions().height}
								onMouseOver={debouncedFocus}
							></iframe>
						</Show>
					</div>

					<Show when={reflection()}>
						{(src) => (
							<img
								class="pointer-events-none -z-10 h-full w-full opacity-25 blur-[20px] transition-opacity duration-1000 md:blur-[24px] lg:blur-[30px] starting:opacity-0"
								alt=""
								src={src()}
								width={props.width}
								height={props.height}
								style={{
									transform: `translateY(${
										100 * 0.89 - (state.window.height * 14) / state.window.width
									}vh) scaleY(-1.5)`,
									'transform-origin': 'center 35%',
								}}
							/>
						)}
					</Show>

					<div
						class="absolute inset-0 top-full -z-10 mx-2 h-fit overflow-y-hidden rounded-b-lg bg-stone-300 py-1 shadow-xl transition-all duration-1000 ease-in-out md:mx-4"
						classList={{
							'-translate-y-full shadow-slate-900/0': !openNav(),
							'translate-y-0 shadow-slate-900/30': openNav(),
						}}
					>
						<nav class="flex items-center gap-4 overflow-x-auto px-3 md:px-6 md:py-1">
							<h2 class="font-bold md:text-lg">{props.slug}</h2>
							<span class="grow" />
							<button onClick={() => refresh()} title="reload" class="p-1">
								<Icon path={arrowPath} class="size-5" />
							</button>
							<a href={props.url} title="fullscreen" class="p-1">
								<Icon path={arrowsPointingOut} class="size-5" />
							</a>
						</nav>
					</div>
				</div>
			</div>
		</>
	)
}
