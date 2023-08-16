import {
	ParentProps,
	createContext,
	onCleanup,
	onMount,
	useContext,
} from 'solid-js'
import { createStore } from 'solid-js/store'

interface State {
	window: { width: number; height: number }
}

const ctx = createContext<State>({ window: { width: 0, height: 0 } })

export const StateProvider = (props: ParentProps) => {
	const [state, setState] = createStore<State>({
		window: { width: 0, height: 0 },
	})

	const onResize = () => {
		console.log('setting state')
		setState('window', {
			width: window.innerWidth,
			height: window.innerHeight,
		})
	}

	onMount(() => {
		window.addEventListener('resize', onResize)

		onResize()
	})

	onCleanup(() => window.removeEventListener('resize', onResize))

	return <ctx.Provider value={state}>{props.children}</ctx.Provider>
}

export const useState = () => {
	return useContext(ctx)
}
