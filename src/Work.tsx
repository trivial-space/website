import { A } from '@solidjs/router'

interface Props {
	img: string
	slug: string
	active: boolean
	width: number
	height: number
}

export default function Work(props: Props) {
	return (
		<div
			class="max-w-[800px] max-h-[800px] mx-12 md:mx-24 shrink-0 flex items-center transition-transform origin-center duration-500"
			classList={{
				['scale-100']: props.active,
				['scale-[0.8]']: !props.active,
			}}
			style={{ perspective: '1000px' }}
			data-id={props.slug}
		>
			<A
				href={`/${props.slug}`}
				class="work-link object-contain w-fit h-auto max-w-[85vw] max-h-[80vh] bg-white my-auto border-[4px] rounded-md border-white shadow-xl shadow-slate-400 transition-filter duration-500 ease-in-out origin-center"
				classList={{ ['blur-[3px]']: !props.active }}
			>
				<img
					alt={props.slug}
					src={props.img}
					class="shadow-lg shadow-white object-contain w-full h-full max-w-[85vw] max-h-[80vh]"
					width={props.width}
					height={props.height}
				/>
			</A>
		</div>
	)
}
