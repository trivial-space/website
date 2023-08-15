import Image, { StaticImageData } from 'next/image'

interface Props {
	img: StaticImageData
	title: string
}

export default function Work({ img, title }: Props) {
	return (
		<div className="w-[600px] h-[600px] max-h-[60vh] max-w-[60vw] mx-12 md:mx-24 shrink-0 flex items-center">
			<div className="object-contain w-full h-auto my-auto border-white rounded border border-4 shadow-xl shadow-slate-400">
				<Image alt={title} {...img} className="" />
			</div>
		</div>
	)
}
