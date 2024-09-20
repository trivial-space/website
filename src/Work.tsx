import { A, useParams } from '@solidjs/router'
import { debounce } from 'lodash'
import { Icon } from 'solid-heroicons'
import { arrowsPointingOut, xMark } from 'solid-heroicons/outline'
import { arrowPath } from 'solid-heroicons/solid'
import { createEffect, createMemo, createSignal, Show } from 'solid-js'
import { Motion, Presence } from './solid-motionone' // TODO: replace with the original library once https://github.com/solidjs-community/solid-motionone/pull/11 is published
import { useState } from './State'

interface Props {
	img: string
	slug: string
	active: boolean
	width: number
	height: number
	url: string
	background: string
}

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

	const dimensions = createMemo(() => {
		const maxWidth = Math.min(
			state.window.width * maxSizeWidthFactor,
			maxSizeBig,
		)

		const maxHeight = Math.min(
			state.window.height * maxSizeHeightFactor,
			maxSizeBig,
		)

		let height = 0
		let width = 0

		width = maxWidth

		if (width < maxSizeBig && openNav()) {
			height = maxHeight
		} else {
			height = maxWidth / aspectRatio()
			if (height > maxHeight) {
				height = maxHeight
				width = height * aspectRatio()
			}
		}

		return { width: Math.floor(width), height: Math.floor(height) }
	})

	let iframe: HTMLIFrameElement | null = null

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
			iframe.contentWindow.focus()
		}
	}, 100)

	return (
		<>
			<Presence>
				<Show when={isPlaying()}>
					<Motion.div
						class="pointer-events-none fixed inset-0 z-40 h-full w-full bg-slate-800"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.6 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 1.6 }}
					/>
				</Show>
			</Presence>
			<div
				style={{ perspective: '1000px' }}
				data-id={props.slug}
				class="relative -mx-8 -mt-8 transition-transform delay-200 duration-500 ease-in-out md:-mx-20"
				classList={{
					['scale-[0.60] translate-y-0']: !isTop(),
					['scale-100 translate-y-[5vh]']: isTop(),
					['z-0']: !isTop(),
					['z-50']: isTop(),
				}}
			>
				<div
					class="work-link relative z-50 my-auto block origin-center rounded-md bg-white object-contain shadow-2xl shadow-slate-600/40 delay-200 duration-500 ease-in-out md:mx-8"
					classList={{
						'blur-[2px] md:blur-[3px]': !props.active && !params.id,
						'blur-[8px] md:blur-[10px]': !props.active && !!params.id,
					}}
					style={{
						width: dimensions().width + 'px',
						height: dimensions().height + 'px',
					}}
				>
					<A href="/" class="absolute -top-6 right-0 opacity-50 md:-top-7">
						<Icon path={xMark} class="size-5 text-white" />
					</A>
					<div
						class="h-full w-full rounded-md border-[4px]"
						classList={{
							'shadow-xl shadow-slate-900/35': openNav(),
						}}
						style={{
							'background-color': props.background,
							'border-color': props.background,
						}}
					>
						<Presence exitBeforeEnter initial={false}>
							<Show
								when={isPlaying()}
								fallback={
									<Motion.div
										class="h-full w-full"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.5, endDelay: 0.5 }}
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
									</Motion.div>
								}
							>
								<Motion.iframe
									ref={iframe}
									class="h-full w-full overflow-hidden"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{
										duration: 0.5,
										delay: props.active ? 0.5 : 0,
										endDelay: 0.3,
									}}
									src={props.url}
									width={dimensions().width}
									height={dimensions().height}
									onMouseOver={debouncedFocus}
								></Motion.iframe>
							</Show>
						</Presence>
					</div>

					<img
						class="pointer-events-none -z-10 h-full w-full border-4 border-b-8 border-slate-800 opacity-25 blur-[18px] md:blur-[20px] lg:blur-[25px]"
						alt={props.slug}
						src={props.img}
						width={props.width}
						height={props.height}
						style={{
							transform: `translateY(${
								100 * 0.89 - (window.innerHeight * 14) / window.innerWidth
							}vh) scaleY(-1.6)`,
							'transform-origin': 'center 36%',
						}}
					/>

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
