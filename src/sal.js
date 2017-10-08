import './sal.scss';

let options = {
  rootMargin: '0px',
  threshold: 0,
  animateClassName: 'sal-animate',
  selector: '[data-sal]',
  disableFor: null,
};

let elements = [];
let intersectionObserver = null;

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
