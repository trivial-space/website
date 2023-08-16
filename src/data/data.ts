export interface Sketch {
	slug: string
	img: string
	href: string
	allowFullscreen: boolean
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
		},
		{
			slug: 'colorwalls',
			img: getImageUrl('colorwalls'),
			href: 'https://construction.trivialspace.net/works/colorwalls/',
			allowFullscreen: true,
		},
		{
			slug: 'glassplates',
			img: getImageUrl('glassplates'),
			href: 'https://construction.trivialspace.net/experiments/wasm/projection/',
			allowFullscreen: true,
		},
		{
			slug: 'stroke',
			img: getImageUrl('stroke'),
			href: 'https://construction.trivialspace.net/experiments/strokes/stroke2/',
			allowFullscreen: false,
		},
		{
			slug: 'tiles',
			img: getImageUrl('tiles'),
			href: 'https://construction.trivialspace.net/works/tiles/',
			allowFullscreen: true,
		},
	],
}
