import { A } from '@solidjs/router'
import { useState } from './State'
import { createMemo } from 'solid-js'

interface Props {
	img: string
	slug: string
	active: boolean
	width: number
	height: number
}

const maxSizeBig = 800
const maxSizeWidthFactor = 0.9
const maxSizeHeightFactor = 0.7

export default function Work(props: Props) {
	const state = useState()

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

	return (
		<div
			style={{ perspective: '1000px' }}
			data-id={props.slug}
			class="-mt-8 transition-transform delay-200 duration-500 ease-in-out"
			classList={{
				['scale-[0.7]']: !props.active,
				['scale-100']: props.active,
			}}
		>
			<A
				href={`/${props.slug}`}
				class="work-link block mx-4 md:mx-8 object-contain bg-white my-auto border-[4px] rounded-md border-white shadow-xl shadow-slate-400 transition-filter duration-500 ease-in-out origin-center"
				classList={{ ['blur-[3px]']: !props.active }}
				style={{ width: width() + 'px', height: height() + 'px' }}
			>
				<img
					alt={props.slug}
					src={props.img}
					class="shadow-lg shadow-white object-contain w-full h-full"
					width={props.width}
					height={props.height}
				/>
			</A>
		</div>
	)
}
