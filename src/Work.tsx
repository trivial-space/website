import { A, useParams } from '@solidjs/router'
import { useState } from './State'
import { createEffect, createMemo, createSignal, Show } from 'solid-js'
import { Motion, Presence } from '@motionone/solid'

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
const maxSizeWidthFactor = 0.9
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
	const [isPlaying, setPlaying] = createSignal(false)

	let iframe: HTMLIFrameElement | null = null

	let timeout: number
	createEffect(() => {
		clearTimeout(timeout)
		if (props.active) {
			setIsTop(true)
			timeout = setTimeout(() => {
				setOpenNav(true)
			}, 600)
		} else {
			setPlaying(false)
			setOpenNav(false)
			if (params.id) {
				setIsTop(false)
			} else {
				timeout = setTimeout(() => {
					setIsTop(false)
				}, 600)
			}
		}
	})

	function togglePlay() {
		setPlaying(props.active && !isPlaying())
		if (iframe) {
			iframe.focus()
		}
	}

	function refresh() {
		if (!isPlaying()) {
			togglePlay()
		} else if (iframe) {
			// eslint-disable-next-line no-self-assign
			iframe.src = iframe.src
		}
	}

	return (
		<>
			<Presence>
				<Show when={props.active}>
					<Motion
						class="fixed inset-0 bg-slate-800 w-full h-full z-40 pointer-events-none "
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.4 }}
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
					['scale-[0.66] ']: !props.active,
					['scale-100 ']: props.active,
					['z-0']: !isTop(),
					['z-50']: isTop(),
				}}
			>
				<div
					class="relative work-link block mx-4 md:mx-8 object-contain my-auto rounded-md shadow-2xl shadow-slate-600/40 transition-filter duration-500 delay-200 ease-in-out origin-center z-50 bg-white"
					classList={{ 'blur-[2px] md:blur-[3px]': !props.active }}
					style={{ width: width() + 'px', height: height() + 'px' }}
				>
					<div
						class="border-[5px] rounded-md border-white w-full h-full "
						classList={{ 'shadow-lg shadow-slate-800/30': openNav() }}
						style={{ 'background-color': props.background }}
					>
						<Presence exitBeforeEnter initial={false}>
							<Show
								when={isPlaying()}
								fallback={
									<Motion.div
										class="w-full h-full"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.5 }}
									>
										<A
											href={`/${props.slug}`}
											classList={{ 'cursor-default': props.active }}
											replace
										>
											<img
												alt={props.slug}
												src={props.img}
												class="object-contain w-full h-full"
												width={props.width}
												height={props.height}
											/>
										</A>
									</Motion.div>
								}
							>
								<Motion.div
									class="w-full h-full overflow-hidden"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
								>
									<iframe
										ref={iframe}
										src={props.url}
										class="w-full h-full overflow-hidden"
										width={width()}
										height={height()}
									/>
								</Motion.div>
							</Show>
						</Presence>
					</div>

					<img
						class="w-full h-full opacity-25 border-4 border-b-8 border-slate-800 blur-[18px] md:blur-[20px] lg:blur-[25px] pointer-events-none -z-10"
						alt={props.slug}
						src={props.img}
						width={props.width}
						height={props.height}
						style={{
							transform: 'translateY(70vh) scaleY(-1.5)',
							'transform-origin': 'center 33%',
						}}
					/>

					<div
						class="absolute top-full mx-2 bg-stone-200 shadow-lg shadow-slate-500/25 inset-0 transition-transform duration-700 ease-in-out overflow-y-hidden h-fit rounded-b-lg -z-10"
						classList={{
							'-translate-y-full': !openNav(),
							'translate-y-0': openNav(),
						}}
					>
						<nav class="pb-4 pt-4 px-6 flex gap-4">
							<button onClick={() => togglePlay()}>
								{isPlaying() ? 'stop' : 'play'}
							</button>
							<button onClick={() => refresh()}>reload</button>
							<a href={props.url}>fullscreen</a>
							<span class="grow" />
							<h2 class="text-lg font-bold">{props.slug}</h2>
						</nav>
					</div>
				</div>
			</div>
		</>
	)
}
