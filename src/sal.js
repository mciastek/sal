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
  selector: '[data-sal]',
  once: true,
  disableFor: null,
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
  intersectionObserver.disconnect();
  intersectionObserver = null;
};

/**
 * Enable sal by launching new IntersectionObserver
 */
const enable = () => {
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

  if (!options.disableFor) {
    enable();
  }

  return {
    elements,
    disable,
    enable,
  };
};

export default init;
