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

  let intersectionObserver = null;

  const animate = element => element.classList.add(animateClassName);

  const isAnimated = element => element.classList.contains(animateClassName);

  const onIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        observer.unobserve(entry.target);
        animate(entry.target);
      }
    });
  };

  if (window.IntersectionObserver) {
    intersectionObserver = new IntersectionObserver(onIntersection, {
      rootMargin,
      threshold,
    });
  } else {
    throw Error('Your browser does not support IntersectionObserver!');
  }

  const elements = [].filter.call(
    document.querySelectorAll(selector),
    element => !isAnimated(element),
  );

  elements.forEach(element => intersectionObserver.observe(element));
}
