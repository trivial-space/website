export interface Sketch {
	slug: string
	img: string
	href: string
	allowFullscreen: boolean
	width: number
	height: number
}

function getImageUrl(name) {
	return new URL(`./imgs/${name}.png`, import.meta.url).href
}

export const data: { sketches: Sketch[] } = {
	sketches: [
		{
			slug: 'colorfields',
			img: getImageUrl('colorfields'),
			href: 'https://construction.trivialspace.net/experiments/paintings/tiles-and-stripes/',
			allowFullscreen: false,
			width: 1310,
			height: 1063,
		},
		{
			slug: 'colorwalls',
			img: getImageUrl('colorwalls'),
			href: 'https://construction.trivialspace.net/works/colorwalls/',
			allowFullscreen: true,
			width: 1811,
			height: 1471,
		},
		{
			slug: 'glassplates',
			img: getImageUrl('glassplates'),
			href: 'https://construction.trivialspace.net/experiments/wasm/projection/',
			allowFullscreen: true,
			width: 1811,
			height: 1471,
		},
		{
			slug: 'stroke',
			img: getImageUrl('stroke'),
			href: 'https://construction.trivialspace.net/experiments/strokes/stroke2/',
			allowFullscreen: false,
			width: 1713,
			height: 1517,
		},
		{
			slug: 'tiles',
			img: getImageUrl('tiles'),
			href: 'https://construction.trivialspace.net/works/tiles/',
			allowFullscreen: true,
			width: 1558,
			height: 1555,
		},
	],
}
