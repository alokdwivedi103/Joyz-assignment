// DOM helper utilities for querying, creation, and event handling

export const querySelector = (selector, scope = document) => scope.querySelector(selector);
export const querySelectorAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export const createElement = (tagName, options = {}) => {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([attributeName, attributeValue]) => {
      if (attributeValue !== undefined && attributeValue !== null) element.setAttribute(attributeName, String(attributeValue));
    });
  }
  return element;
};

export const addEventListener = (element, eventType, eventHandler, options) => {
  element.addEventListener(eventType, eventHandler, options);
  return () => element.removeEventListener(eventType, eventHandler, options);
};

export const delegateEvent = (rootElement, eventType, selector, eventHandler) => {
  return addEventListener(rootElement, eventType, (event) => {
    const potentialTargets = querySelectorAll(selector, rootElement);
    const targetElement = event.target.closest(selector);
    if (targetElement && potentialTargets.includes(targetElement)) {
      eventHandler(event, targetElement);
    }
  });
};


