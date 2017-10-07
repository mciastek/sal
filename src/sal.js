import './sal.scss';

const SELECTOR = '[data-sal]';

let options = {
  rootMargin: '0px',
  threshold: 0,
  animateClassName: 'sal-animate',
};

let elements = [];
let intersectionObserver = null;
let initialized = false;

const animate = element => (
  element.classList.add(options.animateClassName)
);

const isAnimated = element => (
  element.classList.contains(options.animateClassName)
);

const onIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      observer.unobserve(entry.target);
      animate(entry.target);
    }
  });
};

export default function (settings = options) {
  if (settings !== options) {
    options = {
      ...options,
      ...settings,
    };
  }

  if (!window.IntersectionObserver) {
    throw Error(`
      Your browser does not support IntersectionObserver!
      Get a polyfill from here:
      https://github.com/w3c/IntersectionObserver/tree/master/polyfill
    `);
  }

  intersectionObserver = new IntersectionObserver(onIntersection, {
    rootMargin: options.rootMargin,
    threshold: options.threshold,
  });

  elements = [].filter.call(
    document.querySelectorAll(SELECTOR),
    element => !isAnimated(element, options.animateClassName),
  );

  elements.forEach(element => intersectionObserver.observe(element));

  initialized = true;

  return {
    isInitialized: initialized,
  };
}
