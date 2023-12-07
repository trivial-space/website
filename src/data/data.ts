export interface Sketch {
	slug: string
	img: string
	href: string
	allowFullscreen: boolean
	width: number
	height: number
	background: string
}

function getImageUrl(name) {
	return new URL(`./imgs/${name}.png`, import.meta.url).href
}

export const data: { sketches: Sketch[] } = {
	sketches: [
		{
			slug: 'colorfields',
			img: getImageUrl('colorfields'),
			href: 'https://sketches.trivialspace.net/experiments/paintings/tiles-and-stripes/',
			allowFullscreen: false,
			width: 1310,
			height: 1063,
			background: 'white',
		},
		{
			slug: 'colorwalls',
			img: getImageUrl('colorwalls'),
			href: 'https://sketches.trivialspace.net/works/colorwalls/',
			allowFullscreen: true,
			width: 1811,
			height: 1471,
			background: 'black',
		},
		{
			slug: 'glassplates',
			img: getImageUrl('glassplates'),
			href: 'https://sketches.trivialspace.net/experiments/wasm/projection/',
			allowFullscreen: true,
			width: 1811,
			height: 1471,
			background: 'black',
		},
		{
			slug: 'stroke',
			img: getImageUrl('stroke'),
			href: 'https://sketches.trivialspace.net/experiments/strokes/stroke2/',
			allowFullscreen: false,
			width: 1713,
			height: 1517,
			background: 'white',
		},
		{
			slug: 'tiles',
			img: getImageUrl('tiles'),
			href: 'https://sketches.trivialspace.net/works/tiles/',
			allowFullscreen: true,
			width: 1558,
			height: 1555,
			background: 'white',
		},
	],
}
