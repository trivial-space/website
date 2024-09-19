// src/motion.tsx
import { Dynamic } from "solid-js/web";
import { useContext as useContext2, splitProps, createContext as createContext2 } from "solid-js";
import { combineStyle } from "@solid-primitives/props";

// src/primitives.ts
import { createMotionState, createStyles, style } from "@motionone/dom";
import { createEffect, onCleanup, useContext } from "solid-js";

// src/presence.tsx
import { mountedStates } from "@motionone/dom";
import { resolveFirst } from "@solid-primitives/refs";
import { createSwitchTransition } from "@solid-primitives/transition-group";
import {
  createContext,
  createSignal,
  batch
} from "solid-js";
var PresenceContext = createContext();
var Presence = (props) => {
  const [mount, setMount] = createSignal(true), state = { initial: props.initial ?? true, mount }, render = <PresenceContext.Provider value={state}>{createSwitchTransition(
    resolveFirst(() => props.children),
    {
      appear: state.initial,
      mode: props.exitBeforeEnter ? "out-in" : "parallel",
      onExit(el, done) {
        batch(() => {
          setMount(false);
          (mountedStates.get(el)?.getOptions())?.exit ? el.addEventListener("motioncomplete", done) : done();
        });
      },
      onEnter(_, done) {
        batch(() => {
          setMount(true);
          done();
        });
      }
    }
  )}</PresenceContext.Provider>;
  state.initial = true;
  return render;
};

// src/primitives.ts
function createAndBindMotionState(el, options, presence_state, parent_state) {
  const state = createMotionState(
    presence_state?.initial === false ? { ...options(), initial: false } : options(),
    parent_state
  );
  createEffect(() => {
    if (presence_state && !presence_state.mount())
      return;
    const el_ref = el(), unmount = state.mount(el_ref);
    createEffect(() => state.update(options()));
    onCleanup(() => {
      if (presence_state && options().exit) {
        state.setActive("exit", true);
        el_ref.addEventListener("motioncomplete", unmount);
      } else
        unmount();
    });
  });
  return [state, createStyles(state.getTarget())];
}
function createMotion(target, options, presenceState) {
  const [state, styles] = createAndBindMotionState(
    () => target,
    typeof options === "function" ? options : () => options,
    presenceState
  );
  for (const key in styles) {
    style.set(target, key, styles[key]);
  }
  return state;
}
function motion(el, props) {
  createMotion(el, props, useContext(PresenceContext));
}

// src/motion.tsx
var OPTION_KEYS = [
  "initial",
  "animate",
  "inView",
  "inViewOptions",
  "hover",
  "press",
  "variants",
  "transition",
  "exit"
];
var ATTR_KEYS = ["tag"];
var ParentContext = createContext2();
var MotionComponent = (props) => {
  const [options, , attrs] = splitProps(props, OPTION_KEYS, ATTR_KEYS);
  const [state, style2] = createAndBindMotionState(
    () => root,
    () => ({ ...options }),
    useContext2(PresenceContext),
    useContext2(ParentContext)
  );
  let root;
  return <ParentContext.Provider value={state}><Dynamic
    {...attrs}
    ref={(el) => {
      root = el;
      props.ref?.(el);
    }}
    component={props.tag || "div"}
    style={combineStyle(props.style, style2)}
  /></ParentContext.Provider>;
};
var Motion = new Proxy(MotionComponent, {
  get: (_, tag) => (props) => <MotionComponent {...props} tag={tag} />
});
export {
  Motion,
  Presence,
  PresenceContext,
  createMotion,
  motion
};
