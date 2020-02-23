declare namespace sal {
  interface Options {
    rootMargin?: string;
    threshold?: number;
    animateClassName?: string;
    disabledClassName?: string;
    enterEventName?: string,
    exitEventName?: string,
    selector?: string;
    once?: boolean;
    disabled?: boolean;
  }

  interface API {
    elements: HTMLElement[];
    enable: () => void;
    disable: () => void;
    reset: (settings?: Options) => void;
  }

  type Instance = (options?: Options) => API;
}

declare const sal: sal.Instance;

export as namespace sal;
export = sal;
