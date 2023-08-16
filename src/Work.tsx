import { A } from '@solidjs/router'

interface Props {
	img: string
	title: string
	slug: string
}

export default function Work(props: Props) {
	return (
		<div class="w-[600px] h-[600px] max-h-[60vh] max-w-[60vw] mx-12 md:mx-24 shrink-0 flex items-center blur">
			<A
				href={`/${props.slug}`}
				class="work-link object-contain w-full h-auto my-auto border-white border-4 shadow-xl shadow-slate-400"
			>
				<img alt={props.title} src={props.img} class="" />
			</A>
		</div>
	)
}
