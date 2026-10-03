// The viewer stands inside a vertical cylinder, the works hang on its inner
// surface. Scrolling unrolls the strip of works onto the cylinder: a horizontal
// offset `s` of a work from the viewport center becomes the angle `s / radius`.
// The radius only depends on the viewport, never on the number of works.

const deg = Math.PI / 180

// rotation of a work whose center reaches the screen edge, on a square viewport
const edgeAngle = 40 * deg
// how strongly the edge rotation shrinks on wider landscape viewports
const landscapeFalloff = 0.7
// how strongly the edge rotation shrinks on narrower portrait viewports
const portraitFalloff = 0.6
// cylinder radius / viewer distance. 1: viewer at the center, > 1: viewer in
// front of the center, flatter. < 1: viewer behind the center, more curved
const radiusFactor = 1

export interface Cylinder {
	radius: number
	distance: number
	viewWidth: number
}

function cylinder(viewWidth: number, angle: number): Cylinder {
	const radius = viewWidth / (2 * angle)
	return { radius, distance: radius / radiusFactor, viewWidth }
}

export function createCylinder(
	viewWidth: number,
	viewHeight: number,
	maxPanelWidth: number,
): Cylinder {
	const aspect = viewWidth / viewHeight
	let angle =
		edgeAngle * aspect ** (aspect > 1 ? -landscapeFalloff : portraitFalloff)

	// widen the cylinder until even the widest work leaves the screen
	// before it reaches behind the viewer
	for (let i = 0; i < 20; i++) {
		const c = cylinder(viewWidth, angle)
		if (exitAngle(c, maxPanelWidth) !== null) return c
		angle *= 0.9
	}
	return cylinder(viewWidth, angle)
}

// Top view, viewer at the origin looking along +y, front work at depth `distance`.
// Returns a point on a work rotated by `angle`, `offset` along the work from its center.
function point(c: Cylinder, angle: number, offset: number) {
	return {
		x: c.radius * Math.sin(angle) + offset * Math.cos(angle),
		y:
			c.distance -
			c.radius +
			c.radius * Math.cos(angle) -
			offset * Math.sin(angle),
	}
}

// The angle at which a work of `panelWidth` has fully left the screen,
// or null if its far edge would be behind the viewer by then.
function exitAngle(c: Cylinder, panelWidth: number): number | null {
	const half = panelWidth / 2
	const outside = (angle: number) => {
		const near = point(c, angle, -half)
		return c.distance * near.x - (c.viewWidth / 2) * near.y >= 0
	}

	let lo = 0
	let hi = Math.PI / 2
	if (!outside(hi)) return null
	for (let i = 0; i < 30; i++) {
		const mid = (lo + hi) / 2
		if (outside(mid)) hi = mid
		else lo = mid
	}

	const far = point(c, hi, half)
	return far.y > c.distance * 0.05 ? hi : null
}

// Pose of a work at layout offset `s` from the viewport center: cancel the flat
// offset, rotate around the cylinder axis, project from the viewer.
// Offset and angle are linear in `s`, so linear interpolation between two poses is exact.
export function cylinderTransform(c: Cylinder, s: number) {
	return `translateX(${-s}px) perspective(${c.distance}px) translateZ(${c.radius}px) rotateY(${-s / c.radius}rad) translateZ(${-c.radius}px)`
}

// The offset range where a work is visible. Beyond it, the pose should be held
// offscreen instead of rotating behind the viewer.
// `travel` is the offset when the work enters / leaves the viewport in layout.
export function panelRange(
	c: Cylinder,
	visualWidth: number,
	layoutWidth: number,
) {
	const travel = (c.viewWidth + layoutWidth) / 2
	const exit = Math.min(
		(exitAngle(c, visualWidth) ?? Infinity) * c.radius,
		travel,
	)
	return { exit, travel }
}
