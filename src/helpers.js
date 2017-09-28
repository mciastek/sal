export const animate = (element, animateClassName) => (
  element.classList.add(animateClassName)
);

export const isAnimated = (element, animateClassName) => (
  element.classList.contains(animateClassName)
);
