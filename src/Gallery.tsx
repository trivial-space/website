import { For } from "solid-js";
import { useParams } from '@solidjs/router'
import Work from './Work'
import { data } from './data/data'

export default function Gallery() {
	const params = useParams()
	console.log(params)
	return (
		<div class="h-full flex flex-nowrap overflow-x-auto items-center">
			<For each={data.sketches}>{(sketch) => {
				return <Work img={sketch.img} title={sketch.slug} slug={sketch.slug} />
			}}</For>
		</div>
	)
}
