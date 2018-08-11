declare var sal: Sal;

interface Options {
  rootMargin?: string;
  threshold?: number;
  animateClassName?: string;
  disabledClassName?: string;
  selector?: string;
  once?: boolean;
  disabled?: boolean;
}

interface PublicAPI {
  elements: HTMLElement[];
  enable: () => void;
  disable: () => void;
}

type Sal = (options?: Options) => PublicAPI;
export = sal;
