import { A, useParams } from '@solidjs/router'
import { Icon } from 'solid-heroicons'
import { tv } from 'solid-heroicons/outline'
import { arrowPath } from 'solid-heroicons/solid'
import { createEffect, createMemo, createSignal, Show } from 'solid-js'
import { Motion, Presence } from 'solid-motionone'
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

const maxSizeBig = 1000
const maxSizeWidthFactor = 0.95
const maxSizeHeightFactor = 0.8

export default function Work(props: Props) {
	const state = useState()
	const params = useParams()

	const aspectRatio = createMemo(() => props.width / props.height)

	const width = createMemo(() => {
		const maxWidth = Math.min(
			state.window.width * maxSizeWidthFactor,
			maxSizeBig,
		)
		const maxHeight = Math.min(
			state.window.height * maxSizeHeightFactor,
			maxSizeBig,
		)
		const maxSize = Math.min(maxWidth, maxHeight)
		return Math.floor(
			props.width > props.height ? maxSize : maxSize * aspectRatio(),
		)
	})

	const height = createMemo(() => Math.floor(width() / aspectRatio()))

	const [openNav, setOpenNav] = createSignal(false)
	const [isTop, setIsTop] = createSignal(false)
	const [isPlaying, setIsPlaying] = createSignal(false)

	let iframe: HTMLIFrameElement | null = null

	let timeout: number
	createEffect(() => {
		clearTimeout(timeout)
		if (props.active) {
			setIsTop(true)
			setIsPlaying(true)
			timeout = setTimeout(() => {
				setOpenNav(true)
			}, 400)
			requestAnimationFrame(() => {
				if (iframe) {
					iframe.focus()
				}
			})
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

	return (
		<>
			<Presence>
				<Show when={props.active}>
					<Motion
						class="pointer-events-none fixed inset-0 z-40 h-full w-full bg-slate-800"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.6 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6 }}
					/>
				</Show>
			</Presence>
			<div
				style={{ perspective: '1000px' }}
				data-id={props.slug}
				class="relative -mt-8 transition-transform delay-200 duration-500 ease-in-out"
				classList={{
					['scale-[0.66] ']: !isTop(),
					['scale-100 ']: isTop(),
					['z-0']: !isTop(),
					['z-50']: isTop(),
				}}
			>
				<div
					class="work-link transition-filter relative z-50 mx-4 my-auto block origin-center rounded-md bg-white object-contain shadow-2xl shadow-slate-600/40 delay-200 duration-500 ease-in-out md:mx-8"
					classList={{
						'blur-[2px] md:blur-[3px]': !props.active && !params.id,
						'blur-[8px] md:blur-[10px]': !props.active && !!params.id,
					}}
					style={{ width: width() + 'px', height: height() + 'px' }}
				>
					<div
						class="h-full w-full rounded-md border-[5px] border-white"
						classList={{ 'shadow-lg shadow-slate-800/30': openNav() }}
						style={{ 'background-color': props.background }}
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
									transition={{ duration: 0.5, delay: props.active ? 0.5 : 0 }}
									src={props.url}
									width={width()}
									height={height()}
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
								100 * 0.85 - (window.innerHeight * 13) / window.innerWidth
							}vh) scaleY(-1.5)`,
							'transform-origin': 'center 33%',
						}}
					/>

					<div
						class="absolute inset-0 top-full -z-10 mx-2 h-fit overflow-y-hidden rounded-b-lg bg-stone-200 py-1 shadow-lg shadow-slate-500/25 transition-transform duration-1000 ease-in-out"
						classList={{
							'-translate-y-full': !openNav(),
							'translate-y-0': openNav(),
						}}
					>
						<nav class="flex items-center gap-4 overflow-x-auto px-3 py-1 md:gap-6 md:px-6 md:py-2">
							<a href={props.url} title="fullscreen">
								<Icon path={tv} class="h-6 w-6" />
							</a>
							<button onClick={() => refresh()} title="reload">
								<Icon path={arrowPath} class="h-6 w-6" />
							</button>
							<span class="grow" />
							<h2 class="text-lg font-bold">{props.slug}</h2>
						</nav>
					</div>
				</div>
			</div>
		</>
	)
}
