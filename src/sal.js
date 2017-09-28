import {
  animate,
  isAnimated,
} from './helpers';

const defaults = {
  rootMargin: '0px',
  threshold: 1,
  animateClassName: 'animated',
};

export default function (selector = '.js-sal', options = defaults) {
  const {
    rootMargin,
    threshold,
    animateClassName,
  } = options;

  const onIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        observer.unobserve(entry.target);
        animate(entry.target, animateClassName);
      }
    });
  };

  if (!window.IntersectionObserver) {
    throw Error(`
      Your browser does not support IntersectionObserver!
      Get a polyfill from here:
      https://github.com/w3c/IntersectionObserver/tree/master/polyfill
    `);
  }

  const intersectionObserver = new IntersectionObserver(onIntersection, {
    rootMargin,
    threshold,
  });

  const elements = [].filter.call(
    document.querySelectorAll(selector),
    element => !isAnimated(element, animateClassName),
  );

  elements.forEach(element => intersectionObserver.observe(element));

  return elements;
}
