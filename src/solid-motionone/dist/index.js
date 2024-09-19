import { createComponent, mergeProps, Dynamic } from 'solid-js/web';
import { createContext, createSignal, batch, useContext, splitProps, createEffect, onCleanup } from 'solid-js';
import { combineStyle } from '@solid-primitives/props';
import { mountedStates, style, createMotionState, createStyles } from '@motionone/dom';
import { resolveFirst } from '@solid-primitives/refs';
import { createSwitchTransition } from '@solid-primitives/transition-group';

// src/motion.tsx
var PresenceContext = createContext();
var Presence = (props) => {
  const [mount, setMount] = createSignal(true), state = {
    initial: props.initial ?? true,
    mount
  }, render = createComponent(PresenceContext.Provider, {
    value: state,
    get children() {
      return createSwitchTransition(resolveFirst(() => props.children), {
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
      });
    }
  });
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
var OPTION_KEYS = ["initial", "animate", "inView", "inViewOptions", "hover", "press", "variants", "transition", "exit"];
var ATTR_KEYS = ["tag"];
var ParentContext = createContext();
var MotionComponent = (props) => {
  const [options, , attrs] = splitProps(props, OPTION_KEYS, ATTR_KEYS);
  const [state, style2] = createAndBindMotionState(() => root, () => ({
    ...options
  }), useContext(PresenceContext), useContext(ParentContext));
  let root;
  return createComponent(ParentContext.Provider, {
    value: state,
    get children() {
      return createComponent(Dynamic, mergeProps(attrs, {
        ref: (el) => {
          root = el;
          props.ref?.(el);
        },
        get component() {
          return props.tag || "div";
        },
        get style() {
          return combineStyle(props.style, style2);
        }
      }));
    }
  });
};
var Motion = new Proxy(MotionComponent, {
  get: (_, tag) => (props) => createComponent(MotionComponent, mergeProps(props, {
    tag
  }))
});

export { Motion, Presence, PresenceContext, createMotion, motion };
