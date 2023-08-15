import { StaticImageData } from 'next/image'
import ColorfieldsImg from '../public/imgs/colorfields.png'
import ColorwallsImg from '../public/imgs/colorwalls.png'
import GlassPlatesImg from '../public/imgs/glassplates.png'
import StrokeImg from '../public/imgs/stroke.png'
import TilesImg from '../public/imgs/tiles.png'

export interface Sketch {
	slug: string
	img: StaticImageData
	href: string
	allowFullscreen: boolean
}

export const data: { sketches: Sketch[] } = {
	sketches: [
		{
			slug: 'colorfields',
			img: ColorfieldsImg,
			href: 'https://construction.trivialspace.net/experiments/paintings/tiles-and-stripes/',
			allowFullscreen: false,
		},
		{
			slug: 'colorwalls',
			img: ColorwallsImg,
			href: 'https://construction.trivialspace.net/works/colorwalls/',
			allowFullscreen: true,
		},
		{
			slug: 'glassplates',
			img: GlassPlatesImg,
			href: 'https://construction.trivialspace.net/experiments/wasm/projection/',
			allowFullscreen: true,
		},
		{
			slug: 'stroke',
			img: StrokeImg,
			href: 'https://construction.trivialspace.net/experiments/strokes/stroke2/',
			allowFullscreen: false,
		},
		{
			slug: 'tiles',
			img: TilesImg,
			href: 'https://construction.trivialspace.net/works/tiles/',
			allowFullscreen: true,
		},
	],
}
