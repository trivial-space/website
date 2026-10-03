import { Accessor, createEffect, createSignal, on, onCleanup } from 'solid-js'

export const tw = String.raw

// Keeps an element mounted while its css exit transition runs. `shown` switches
// on two frames after mounting, so the enter transition starts from the hidden styles.
export function createPresence(when: Accessor<boolean>, exitMs: number) {
	const [mounted, setMounted] = createSignal(when())
	const [shown, setShown] = createSignal(when())
	let timeout = 0
	let frame = 0

	createEffect(
		on(
			when,
			(show) => {
				clearTimeout(timeout)
				cancelAnimationFrame(frame)
				if (show) {
					setMounted(true)
					frame = requestAnimationFrame(() => {
						frame = requestAnimationFrame(() => setShown(true))
					})
				} else {
					setShown(false)
					timeout = setTimeout(() => setMounted(false), exitMs)
				}
			},
			{ defer: true },
		),
	)

	onCleanup(() => {
		clearTimeout(timeout)
		cancelAnimationFrame(frame)
	})

	return { mounted, shown }
}
