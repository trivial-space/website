// The reflection of a work on the ground: the thumbnail with its frame,
// faded out towards its top and blurred. It is flipped in css, so the top ends
// up farthest from the work. Drawn small, since it is heavily blurred anyway.
// The blur is baked in, a css blur on the moving works is expensive to render.

const width = 460
// fade, as shares of the height measured from the work: fully opaque until
// fadeStart, fully transparent from fadeEnd on (1 = the far edge)
const fadeStart = 0.05
const fadeEnd = 0.7
// frame thickness relative to the width, the bottom one doubled
const frame = 0.004
// blur radius relative to the width (0.03 ≈ 30px on a 1000px wide work)
const blur = 0.04

export interface Reflection {
	src: string
	// transparent room around the image for the blur,
	// relative to the image width and height
	padX: number
	padY: number
}

export async function createReflection(
	src: string,
	frameColor: string,
): Promise<Reflection> {
	const img = new Image()
	img.src = src
	await img.decode()

	const height = Math.round((width * img.naturalHeight) / img.naturalWidth)
	const radius = Math.max(1, Math.round(width * blur))
	const pad = 3 * radius
	const canvas = document.createElement('canvas')
	canvas.width = width + 2 * pad
	canvas.height = height + 2 * pad
	const ctx = canvas.getContext('2d')!
	ctx.translate(pad, pad)

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

	const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
	blurImage(data, radius)
	ctx.putImageData(data, 0, 0)

	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve),
	)
	if (!blob) throw new Error('could not create reflection of ' + src)
	return {
		src: URL.createObjectURL(blob),
		padX: pad / width,
		padY: pad / height,
	}
}

// Three box blur passes approximate a gaussian blur with sigma ≈ radius.
// Works on premultiplied alpha, so transparent areas don't darken the edges.
function blurImage(image: ImageData, radius: number) {
	const { width, height, data } = image
	const a = new Float32Array(data.length)
	const b = new Float32Array(data.length)

	for (let i = 0; i < data.length; i += 4) {
		const alpha = data[i + 3] / 255
		a[i] = data[i] * alpha
		a[i + 1] = data[i + 1] * alpha
		a[i + 2] = data[i + 2] * alpha
		a[i + 3] = data[i + 3]
	}

	for (let pass = 0; pass < 3; pass++) {
		boxBlur(a, b, width, height, radius, 4, width * 4)
		boxBlur(b, a, height, width, radius, width * 4, 4)
	}

	for (let i = 0; i < data.length; i += 4) {
		const alpha = a[i + 3] / 255
		data[i] = alpha ? a[i] / alpha : 0
		data[i + 1] = alpha ? a[i + 1] / alpha : 0
		data[i + 2] = alpha ? a[i + 2] / alpha : 0
		data[i + 3] = a[i + 3]
	}
}

// Blurs `lines` lines of `length` pixels from src into dst, with a sliding
// window sum. `step` and `stride` are the offsets between pixels and lines.
function boxBlur(
	src: Float32Array,
	dst: Float32Array,
	length: number,
	lines: number,
	radius: number,
	step: number,
	stride: number,
) {
	const scale = 1 / (2 * radius + 1)
	for (let line = 0; line < lines; line++) {
		const start = line * stride
		for (let c = 0; c < 4; c++) {
			let sum = 0
			for (let i = 0; i <= radius && i < length; i++) {
				sum += src[start + i * step + c]
			}
			for (let i = 0; i < length; i++) {
				dst[start + i * step + c] = sum * scale
				const add = i + radius + 1
				const remove = i - radius
				if (add < length) sum += src[start + add * step + c]
				if (remove >= 0) sum -= src[start + remove * step + c]
			}
		}
	}
}
