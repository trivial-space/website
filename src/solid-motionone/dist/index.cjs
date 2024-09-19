'use strict';

var web = require('solid-js/web');
var solidJs = require('solid-js');
var props = require('@solid-primitives/props');
var dom = require('@motionone/dom');
var refs = require('@solid-primitives/refs');
var transitionGroup = require('@solid-primitives/transition-group');

// src/motion.tsx
exports.PresenceContext = solidJs.createContext();
exports.Presence = (props) => {
  const [mount, setMount] = solidJs.createSignal(true), state = {
    initial: props.initial ?? true,
    mount
  }, render = web.createComponent(exports.PresenceContext.Provider, {
    value: state,
    get children() {
      return transitionGroup.createSwitchTransition(refs.resolveFirst(() => props.children), {
        appear: state.initial,
        mode: props.exitBeforeEnter ? "out-in" : "parallel",
        onExit(el, done) {
          solidJs.batch(() => {
            setMount(false);
            (dom.mountedStates.get(el)?.getOptions())?.exit ? el.addEventListener("motioncomplete", done) : done();
          });
        },
        onEnter(_, done) {
          solidJs.batch(() => {
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
  const state = dom.createMotionState(
    presence_state?.initial === false ? { ...options(), initial: false } : options(),
    parent_state
  );
  solidJs.createEffect(() => {
    if (presence_state && !presence_state.mount())
      return;
    const el_ref = el(), unmount = state.mount(el_ref);
    solidJs.createEffect(() => state.update(options()));
    solidJs.onCleanup(() => {
      if (presence_state && options().exit) {
        state.setActive("exit", true);
        el_ref.addEventListener("motioncomplete", unmount);
      } else
        unmount();
    });
  });
  return [state, dom.createStyles(state.getTarget())];
}
function createMotion(target, options, presenceState) {
  const [state, styles] = createAndBindMotionState(
    () => target,
    typeof options === "function" ? options : () => options,
    presenceState
  );
  for (const key in styles) {
    dom.style.set(target, key, styles[key]);
  }
  return state;
}
function motion(el, props) {
  createMotion(el, props, solidJs.useContext(exports.PresenceContext));
}

// src/motion.tsx
var OPTION_KEYS = ["initial", "animate", "inView", "inViewOptions", "hover", "press", "variants", "transition", "exit"];
var ATTR_KEYS = ["tag"];
var ParentContext = solidJs.createContext();
var MotionComponent = (props$1) => {
  const [options, , attrs] = solidJs.splitProps(props$1, OPTION_KEYS, ATTR_KEYS);
  const [state, style2] = createAndBindMotionState(() => root, () => ({
    ...options
  }), solidJs.useContext(exports.PresenceContext), solidJs.useContext(ParentContext));
  let root;
  return web.createComponent(ParentContext.Provider, {
    value: state,
    get children() {
      return web.createComponent(web.Dynamic, web.mergeProps(attrs, {
        ref: (el) => {
          root = el;
          props$1.ref?.(el);
        },
        get component() {
          return props$1.tag || "div";
        },
        get style() {
          return props.combineStyle(props$1.style, style2);
        }
      }));
    }
  });
};
exports.Motion = new Proxy(MotionComponent, {
  get: (_, tag) => (props) => web.createComponent(MotionComponent, web.mergeProps(props, {
    tag
  }))
});

exports.createMotion = createMotion;
exports.motion = motion;
