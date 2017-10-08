import './sal.scss';

let options = {
  rootMargin: '0px',
  threshold: 0.5,
  animateClassName: 'sal-animate',
  selector: '[data-sal]',
  once: true,
  disableFor: null,
};

let elements = [];
let intersectionObserver = null;

const animate = element => (
  element.classList.add(options.animateClassName)
);

const reverse = element => (
  element.classList.remove(options.animateClassName)
);

const isAnimated = element => (
  element.classList.contains(options.animateClassName)
);

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

const disable = () => {
  intersectionObserver.disconnect();
  intersectionObserver = null;
};

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
