// The reflection of a work on the ground: the thumbnail with its frame,
// faded out towards its top. It is flipped in css, so the top ends up farthest
// from the work. Drawn small, since it is shown heavily blurred anyway.

const width = 460
// fade, as shares of the height measured from the work: fully opaque until
// fadeStart, fully transparent from fadeEnd on (1 = the far edge)
const fadeStart = 0.05
const fadeEnd = 0.7
// frame thickness relative to the width, the bottom one doubled
const frame = 0.004

export async function createReflection(
	src: string,
	frameColor: string,
): Promise<string> {
	const img = new Image()
	img.src = src
	await img.decode()

	const height = Math.round((width * img.naturalHeight) / img.naturalWidth)
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const ctx = canvas.getContext('2d')!

	const border = width * frame
	ctx.fillStyle = frameColor
	ctx.fillRect(0, 0, width, height)
	ctx.drawImage(img, border, border, width - 2 * border, height - 3 * border)

	// keeps the drawn alpha only where the gradient is opaque
	const fade = ctx.createLinearGradient(0, height, 0, 0)
	fade.addColorStop(fadeStart, 'black')
	fade.addColorStop(fadeEnd, 'transparent')
	ctx.globalCompositeOperation = 'destination-in'
	ctx.fillStyle = fade
	ctx.fillRect(0, 0, width, height)

	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve),
	)
	if (!blob) throw new Error('could not create reflection of ' + src)
	return URL.createObjectURL(blob)
}
