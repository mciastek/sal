declare namespace sal {
  interface Options {
    root: Element | null;
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
    /**
     * Collection of elements to be animated.
     */
    elements: HTMLElement[];

    /**
     * Enables instance by launching new IntersectionObserver.
     */
    enable: () => void;

    /**
     * Disables instance by removing animations and clearing observer.
     */
    disable: () => void;

    /**
     * Resets instance to provide new settings.
     * @param {Options} settings
     */
    reset: (settings?: Options) => void;

    /**
     * Updates observer with new elements to animated.
     * Useful for dynamically injected elements.
     */
    update: () => void;
  }

  type Instance = (options?: Options) => API;
}

declare const sal: sal.Instance;

export as namespace sal;
export = sal;
