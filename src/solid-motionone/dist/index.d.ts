import * as motionone from '@motionone/dom';
import { MotionState } from '@motionone/dom';
import { PropertiesHyphen } from 'csstype';
import * as solid_js from 'solid-js';
import { ParentProps, JSX, FlowComponent, Accessor } from 'solid-js';

type VariantDefinition = motionone.VariantDefinition;
interface MotionEventHandlers {
    onMotionStart?: (event: motionone.MotionEvent) => void;
    onMotionComplete?: (event: motionone.MotionEvent) => void;
    onHoverStart?: (event: motionone.CustomPointerEvent) => void;
    onHoverEnd?: (event: motionone.CustomPointerEvent) => void;
    onPressStart?: (event: motionone.CustomPointerEvent) => void;
    onPressEnd?: (event: motionone.CustomPointerEvent) => void;
    onViewEnter?: (event: motionone.ViewEvent) => void;
    onViewLeave?: (event: motionone.ViewEvent) => void;
}
declare module "@motionone/dom" {
    interface CSSStyleDeclarationWithTransform extends Omit<PropertiesHyphen, "direction" | "transition"> {
    }
}
type Options = motionone.Options & {
    exit?: VariantDefinition;
};
type MotionComponentProps = ParentProps<MotionEventHandlers & Options>;
type MotionComponent = {
    (props: JSX.IntrinsicElements["div"] & MotionComponentProps): JSX.Element;
    <T extends keyof JSX.IntrinsicElements>(props: JSX.IntrinsicElements[T] & MotionComponentProps & {
        tag: T;
    }): JSX.Element;
};
type MotionProxyComponent<T> = (props: T & MotionComponentProps) => JSX.Element;
type MotionProxy = MotionComponent & {
    [K in keyof JSX.IntrinsicElements]: MotionProxyComponent<JSX.IntrinsicElements[K]>;
};
declare module "solid-js" {
    namespace JSX {
        interface Directives {
            motion: Options;
        }
    }
}
type E = JSX.Element;

/**
 * Renders an animatable HTML or SVG element.
 *
 * @component
 * Animation props:
 * - `animate` a target of values to animate to. Accepts all the same values and keyframes as Motion One's [animate function](https://motion.dev/dom/animate). This prop is **reactive** – changing it will animate the transition element to the new state.
 * - `transition` for changing type of animation
 * - `initial` a target of values to animate from when the element is first rendered.
 * - `exit` a target of values to animate to when the element is removed. The element must be a direct child of the `<Presence>` component.
 *
 * @example
 * ```tsx
 * <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}/>
 * ```
 *
 * Interaction animation props:
 *
 * - `inView` animation target for when the element is in view
 * - `hover` animate when hovered
 * - `press` animate when pressed
 *
 * @example
 * ```tsx
 * <Motion.div hover={{ scale: 1.2 }} press={{ scale: 0.9 }}/>
 * ```
 */
declare const Motion: MotionProxy;

type PresenceContextState = {
    initial: boolean;
    mount: Accessor<boolean>;
};
declare const PresenceContext: solid_js.Context<PresenceContextState | undefined>;
/**
 * Perform exit/enter trantisions of children `<Motion>` components.
 *
 * accepts props:
 * - `initial` – *(Defaults to `true`)* – If `false`, will disable the first animation on all child `Motion` elements the first time `Presence` is rendered.
 * - `exitBeforeEnter` – *(Defaults to `false`)* – If `true`, `Presence` will wait for the exiting element to finish animating out before animating in the next one.
 *
 * @example
 * ```tsx
 * <Presence exitBeforeEnter>
 *   <Show when={toggle()}>
 *     <Motion.div
 *       initial={{ opacity: 0 }}
 *       animate={{ opacity: 1 }}
 *       exit={{ opacity: 0 }}
 *     />
 *   </Show>
 * </Presence>
 * ```
 */
declare const Presence: FlowComponent<{
    initial?: boolean;
    exitBeforeEnter?: boolean;
}>;

/**
 * createMotion provides MotionOne as a compact Solid primitive.
 *
 * @param target Target Element to animate.
 * @param options Options to effect the animation.
 * @param presenceState Optional PresenceContext override, defaults to current parent.
 * @returns Object to access MotionState
 */
declare function createMotion(target: Element, options: Accessor<Options> | Options, presenceState?: PresenceContextState): MotionState;
/**
 * motion is a Solid directive that makes binding to elements easier.
 *
 * @param el Target Element to bind to.
 * @param props Options to effect the animation.
 */
declare function motion(el: Element, props: Accessor<Options>): void;

export { type E, Motion, type MotionComponent, type MotionComponentProps, type MotionEventHandlers, type MotionProxy, type MotionProxyComponent, type Options, Presence, PresenceContext, type VariantDefinition, createMotion, motion };
