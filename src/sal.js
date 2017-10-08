/**
 * Sal - Scroll Animation Library
 * Highly performant, lightweight scroll animation library
 */

import './sal.scss';

/**
 * Default options
 */
let options = {
  rootMargin: '0px',
  threshold: 0.5,
  animateClassName: 'sal-animate',
  disabledClassName: 'sal-disabled',
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
 * Launch animation by adding class
 * @param  {Node} element
 */
const animate = element => (
  element.classList.add(options.animateClassName)
);

/**
 * Reverse animation by removing class
 * @param  {Node} element
 */
const reverse = element => (
  element.classList.remove(options.animateClassName)
);

/**
 * Check if element was animated
 * @param  {Node} element
 */
const isAnimated = element => (
  element.classList.contains(options.animateClassName)
);

/**
 * Check if should be disabled
 * @return {Boolean}
 */
const isDisabled = () => (
  options.disabled ||
  (
    (typeof options.disabled === 'function') &&
    options.disabled()
  )
);

/**
 * IntersectionObserver callback
 * @param  {Array<IntersectionObserverEntry>} entries
 * @param  {IntersectionObserver} observer
 */
const onIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      animate(entry.target);

      if (!options.once) {
        observer.unobserve(entry.target);
      }
    } else if (!options.once) {
      reverse(entry.target);
    }
  });
};

/**
 * Disable sal
 */
const disable = () => {
  document.body.classList.add(options.disabledClassName);

  intersectionObserver.disconnect();
  intersectionObserver = null;
};

/**
 * Enable sal by launching new IntersectionObserver
 */
const enable = () => {
  document.body.classList.remove(options.disabledClassName);

  intersectionObserver = new IntersectionObserver(onIntersection, {
    rootMargin: options.rootMargin,
    threshold: options.threshold,
  });

  elements = [].filter.call(
    document.querySelectorAll(options.selector),
    element => !isAnimated(element, options.animateClassName),
  );

  elements.forEach(element => intersectionObserver.observe(element));
};

/**
 * Init
 * @param  {Object} settings
 * @return {Object} public API
 */
const init = (settings = options) => {
  if (settings !== options) {
    options = {
      ...options,
      ...settings,
    };
  }

  if (!isDisabled) {
    enable();
  }

  return {
    elements,
    disable,
    enable,
  };
};

export default init;
