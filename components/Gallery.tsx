import Work from './Work'
import { data } from './data'

export default function Gallery() {
	return (
		<div className="h-full flex flex-nowrap overflow-x-auto items-center">
			{data.sketches.map((sketch) => {
				return <Work img={sketch.img} title={sketch.slug} key={sketch.slug} />
			})}
		</div>
	)
}
