/**
 * Sal - Scroll Animation Library
 * Performance focused, lightweight scroll animation library
 */

import './sal.scss';

const SSR_MESSAGE = 'Sal was not initialised! Probably it is used in SSR.';

const NOT_SUPPORTED_MESSAGE = ''
  + 'Your browser does not support IntersectionObserver!\n'
  + 'Get a polyfill from here:\n'
  + 'https://github.com/w3c/IntersectionObserver/tree/master/polyfill';

/**
 * Default options
 */
let options = {
  root: null,
  rootMargin: '0% 50%',
  threshold: 0.5,
  animateClassName: 'sal-animate',
  disabledClassName: 'sal-disabled',
  enterEventName: 'sal:in',
  exitEventName: 'sal:out',
  selector: '[data-sal]',
  once: true,
  disabled: false,
};

/**
 * Private
 */
let elements = [];
let intersectionObserver = null;

/**
 * Sets options.
 * @param {Object} settings
 */
const setOptions = (settings) => {
  if (settings && settings !== options) {
    options = {
      ...options,
      ...settings,
    };
  }
};

/**
 * Clears animation for given element.
 * @param {HTMLElement} element
 */
const clearAnimation = (element) => {
  element.classList.remove(options.animateClassName);
};

/**
 * Dispatches the animate event on the intersection observer entry.
 * @param {IntersectionObserverEntry} detail The entry to fire event on.
 */
const fireEvent = (name, entry) => {
  const event = new CustomEvent(name, {
    bubbles: true,
    detail: entry,
  });

  entry.target.dispatchEvent(event);
};

/**
 * Launches animation by adding class.
 * @param {IntersectionObserverEntry} entry
 */
const animate = (entry) => {
  entry.target.classList.add(options.animateClassName);
  fireEvent(options.enterEventName, entry);
};

/**
 * Reverses animation by removing class.
 * @param {IntersectionObserverEntry} entry
 */
const reverse = (entry) => {
  clearAnimation(entry.target);
  fireEvent(options.exitEventName, entry);
};

/**
 * Checks if element was animated.
 * @param {HTMLElement} element
 */
const isAnimated = (element) => (
  element.classList.contains(options.animateClassName)
);

/**
 * Enables animations by remove class from body.
 */
const enableAnimations = () => {
  document.body.classList.remove(options.disabledClassName);
};

/**
 * Disables animations by add class from body.
 */
const disableAnimations = () => {
  document.body.classList.add(options.disabledClassName);
};

/**
 * Clears observer.
 */
const clearObserver = () => {
  intersectionObserver.disconnect();
  intersectionObserver = null;
};

/**
 * Check if should be disabled.
 * @return {Boolean}
 */
const isDisabled = () => (
  options.disabled
  || (
    (typeof options.disabled === 'function')
    && options.disabled()
  )
);

/**
 * IntersectionObserver callback.
 * @param  {Array<IntersectionObserverEntry>} entries
 * @param  {IntersectionObserver} observer
 */
const onIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    const { target } = entry;
    const hasRepeatFlag = target.dataset.salRepeat !== undefined;
    const hasOnceFlag = target.dataset.salOnce !== undefined;
    const shouldRepeat = hasRepeatFlag || !(hasOnceFlag || options.once);

    if (entry.intersectionRatio >= options.threshold) {
      animate(entry);

      if (!shouldRepeat) {
        observer.unobserve(target);
      }
    } else if (shouldRepeat) {
      reverse(entry);
    }
  });
};

/**
 * Returns collection of elements and pushes them to observer.
 *
 * @returns {Array<Node>}
 */
const getObservedElements = () => {
  const collection = [].filter.call(
    document.querySelectorAll(options.selector),
    (element) => !isAnimated(element, options.animateClassName),
  );

  collection.forEach((element) => intersectionObserver.observe(element));

  return collection;
};

/**
 * Disables instance by removing animations and clearing observer.
 */
const disable = () => {
  disableAnimations();
  clearObserver();
};

/**
 * Enables instance by launching new IntersectionObserver.
 */
const enable = () => {
  enableAnimations();

  intersectionObserver = new IntersectionObserver(onIntersection, {
    root: options.root,
    rootMargin: options.rootMargin,
    threshold: options.threshold,
  });

  elements = getObservedElements();
};

/**
 * Resets instance to provide new settings.
 * @param {Object} settings
 */
const reset = (settings = {}) => {
  clearObserver();

  Array.from(document.querySelectorAll(options.selector))
    .forEach(clearAnimation);

  setOptions(settings);
  enable();
};

/**
 * Updates observer with new elements to animated.
 * Useful for dynamically injected elements.
 */
const update = () => {
  const newElements = getObservedElements();
  elements.push(newElements);
};

/**
 * Init
 * @param  {Object} settings
 * @return {Object} public API
 */
const init = (settings = options) => {
  setOptions(settings);

  // Early return, when window object is not defined
  // e.g. during Server Side Rendering
  if (typeof window === 'undefined') {
    // eslint-disable-next-line no-console
    console.warn(SSR_MESSAGE);

    return {
      elements,
      disable,
      enable,
      reset,
      update,
    };
  }

  if (!window.IntersectionObserver) {
    disableAnimations();

    throw Error(NOT_SUPPORTED_MESSAGE);
  }

  if (!isDisabled()) {
    enable();
  } else {
    disableAnimations();
  }

  return {
    elements,
    disable,
    enable,
    reset,
    update,
  };
};

export default init;
