// DOM helper utilities for querying, creation, and event handling

export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export const createEl = (tag, options = {}) => {
  const el = document.createElement(tag);
  if (options.className) el.className = options.className;
  if (options.text) el.textContent = options.text;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) el.setAttribute(key, String(value));
    });
  }
  return el;
};

export const on = (el, event, handler, options) => {
  el.addEventListener(event, handler, options);
  return () => el.removeEventListener(event, handler, options);
};

export const delegate = (root, eventName, selector, handler) => {
  return on(root, eventName, (event) => {
    const potentialTargets = qsa(selector, root);
    const target = event.target.closest(selector);
    if (target && potentialTargets.includes(target)) {
      handler(event, target);
    }
  });
};


