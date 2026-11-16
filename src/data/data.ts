export interface Sketch {
	title: string
	slug: string
	img: string
	href: string
	allowFullscreen: boolean
	width: number
	height: number
	background: string
}

function getImageUrl(name: string) {
	return new URL(`./imgs/${name}.webp`, import.meta.url).href
}

export function slugify(title: string) {
	return title
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

const sketches: Omit<Sketch, 'slug'>[] = [
	{
		title: 'color fields',
		img: getImageUrl('colorfields'),
		href: 'https://sketches-old.trivialspace.net/experiments/paintings/tile-fields/',
		allowFullscreen: false,
		width: 1808,
		height: 1494,
		background: 'white',
	},
	{
		title: 'pillars',
		img: getImageUrl('pillars'),
		href: 'https://sketches.trivialspace.net/rooms/columns/',
		allowFullscreen: true,
		width: 1200,
		height: 800,
		background: 'white',
	},
	{
		title: 'color walls',
		img: getImageUrl('colorwalls'),
		href: 'https://sketches-old.trivialspace.net/works/colorwalls/',
		allowFullscreen: true,
		width: 1811,
		height: 1471,
		background: 'black',
	},
	{
		title: 'glass plates',
		img: getImageUrl('glassplates'),
		href: 'https://sketches-old.trivialspace.net/experiments/wasm/projection/',
		allowFullscreen: true,
		width: 1811,
		height: 1471,
		background: 'black',
	},
	{
		title: 'stroke',
		img: getImageUrl('stroke'),
		href: 'https://sketches-old.trivialspace.net/experiments/strokes/stroke2/',
		allowFullscreen: false,
		width: 1713,
		height: 1517,
		background: 'white',
	},
	{
		title: 'tiles',
		img: getImageUrl('tiles'),
		href: 'https://sketches-old.trivialspace.net/works/tiles/',
		allowFullscreen: true,
		width: 1558,
		height: 1555,
		background: 'white',
	},
	{
		title: 'homage',
		img: getImageUrl('homage'),
		href: 'https://sketches-old.trivialspace.net/works/homage/',
		allowFullscreen: true,
		width: 2309,
		height: 1535,
		background: 'black',
	},
]

export const data: { sketches: Sketch[] } = {
	sketches: sketches.map((s) => ({ ...s, slug: slugify(s.title) })),
}
