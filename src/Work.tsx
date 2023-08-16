import { A } from '@solidjs/router'

interface Props {
	img: string
	title: string
	slug: string
	active: boolean
}

export default function Work(props: Props) {
	return (
		<div
			class="w-[600px] h-[600px] max-h-fit max-w-[60vw] mx-16 md:mx-32 shrink-0 flex items-center"
			style={{ perspective: '1000px' }}
		>
			<A
				href={`/${props.slug}`}
				class={`work-link object-contain w-full h-auto my-auto border-[4px] rounded-md border-white shadow-xl shadow-slate-400 ${
					!props.active ? 'blur-sm' : ''
				} $} transition-filter duration-500 ease-in-out origin-center`}
			>
				<img alt={props.title} src={props.img} class="shadow-lg shadow-white" />
			</A>
		</div>
	)
}
