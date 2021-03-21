# Sal [![npm version](https://badge.fury.io/js/sal.js.svg)](https://www.npmjs.com/package/sal.js) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/mciastek/sal/blob/master/LICENSE) [![Build Status](https://travis-ci.com/mciastek/sal.svg?branch=master)](https://travis-ci.com/mciastek/sal)

Performance focused, lightweight (less than **2.8 kb**) scroll animation library, written in vanilla JavaScript. No dependencies!

**Sal** (_Scroll Animation Library_) was created to provide a performant and lightweight solution for animating elements on scroll. It's based on the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which gives amazing performance in terms of checking the element's presence in the viewport.

**Note:** Intersection Observer API is an experimental technology so be sure to consult the [browser compatibility table](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Browser_compatibility) and consider using a [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Animations](#animations)
- [Options](#options)
- [API](#api)
- [Events](#events)
- [Misc](#misc)
- [License](#license)

## Install

```sh
# Usage with NPM
$ npm install --save sal.js

# and with Yarn
$ yarn add sal.js
```

Load it with your favorite module loader or use as a global variable

```js
// ES6 modules
import sal from 'sal.js'

// CommonJS modules
var sal = require('sal.js')
```

And remember to add styles

```scss
// Webpack
@import '~sal.js/sal.css';

// Other
@import './node_modules/sal.js/dist/sal.css';
```

## Usage

In HTML, add a `data-sal` attribute with the animation name as value, e.g.:

```html
<div data-sal="fade"></div>
```

Then simply initialize Sal in your script file:

```js
sal();
```

It will look for all elements with a `data-sal` attribute and launch their animation when in viewport.

## Animations
In **sal.js** you can easily change animation's options, by adding a proper `data` attribute:
- `data-sal-duration` - changes duration of the animation (from 200 to 2000 ms)
- `data-sal-delay` - adds delay to the animation (from 5 to 1000 ms)
- `data-sal-easing` - sets easing for the animation (see [easings.net](https://easings.net/) for reference)

For example:
```html
<div
  data-sal="slide-up"
  data-sal-delay="300"
  data-sal-easing="ease-out-back"
></div>
```

The library supports several animations:
- `fade`
- `slide-up`
- `slide-down`
- `slide-left`
- `slide-right`
- `zoom-in`
- `zoom-out`
- `flip-up`
- `flip-down`
- `flip-left`
- `flip-right`

### Duration and delay

Additionaly, when you want to customise animation's properties - `duration`, `delay` and `easing`, you can use [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to set any value you want. See the following example:

```html
<div
  data-sal="slide-up"
  style="--sal-duration: 3s; --sal-delay: 2s;"
></div>
```

Supported custom properties:
  - `--sal-duration`
  - `--sal-delay`
  - `--sal-easing`

Remember, that you can use only data attributes (e.g. `data-sal-delay`) or CSS custom properties (e.g. `--sal-delay`). Data attributes have precedence over CSS custom properties.

### Repeating animation

By default every animation is played once. You can change it by setting `once` option to `false` (see [Options](#options)). What's more, it's possible to override this option for an animated element by adding one of the following attributes:
- `data-sal-repeat` - forces animation replay
- `data-sal-once` - plays animation once

## Options

| Property | Type | Description | Default  |
|---------------------------|-------------|---------------|---------|
| `threshold` | Number | Percentage of an element's area that needs to be visible to launch animation (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)) | `0.5` |
| `once` | Boolean | Defines if animation needs to be launched once. Can be overridden, see [Repeating Animation](#repeating-animation). | `true` |
| `disabled` | Boolean or Function | Flag (or a function returning boolean) for disabling animations | `false` |

You can set options during Sal's initialization, e.g.:

```js
sal({
  threshold: 1,
  once: false,
});
```

### Advanced options

| Property | Type | Description | Default  |
|---------------------------|-------------|---------------|---------|
| `root` | Element or null | The element that is used as the viewport for checking visibility of the target (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)) | `window` |
| `selector` | String | Selector of the elements to be animated | `[data-sal]` |
| `animateClassName` | String | Class name which triggers animation | `sal-animate` |
| `disabledClassName` | String | Class name which defines the disabled state | `sal-disabled` |
| `rootMargin` | String | Corresponds to root's bounding box margin (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)) | `0% 50%` |
| `enterEventName` | String | Enter event name (see [Events](#events)) | `sal:in` |
| `exitEventName` | String | Exit event name (see [Events](#events)) | `sal:out` |

## API

| Method name | Description |
|---------------------------|-------------|
| `enable` | Enables animations |
| `disable` | Disables animations |
| `reset` | Resets instance and allows to pass new options (see [Options](#options)) |
| `update` | Updates observer with new elements to animated. Useful for dynamically injected HTML. |

Public methods are available after Sal's initialization:

```js
const scrollAnimations = sal();

scrollAnimations.disable();
```

### Changing options after intialization

If you want to change Sal's options once it's been initialized, you should use `reset` method, that allows you to pass new set of options. It can be useful, when you would like to provide different options for specific viewport sizes.

```js
const scrollAnimations = sal();

// Provide new options
scrollAnimations.reset({
  selector: 'animated-element',
  once: true,
});
```

## Events

This library supports events, fired when element is entering or exiting viewport (they are named `sal:in` and `sal:out` by default). Property `detail` is [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) object.


You can attach listener to specific element.

```js
// Get element with ".animated" class, which has "data-sal" attribute
const element = document.querySelector('.animated');

element.addEventListener('sal:in', ({ detail }) => {
  console.log('entering', detail.target);
});
```

or to the whole document

```js
document.addEventListener('sal:out', ({ detail }) => {
  console.log('exiting', detail.target);
});
```

**Note:** This library uses [Custom Event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) to trigger events on animated elements. Check the [compatibility table](https://caniuse.com/#search=custom%20event) to know if your browser supports it and use a [polyfill](https://github.com/kumarharsh/custom-event-polyfill) if needed.

## Misc

### No-JS support

If you aim to support users that don't allow sites to use JavaScript, you should consider disabling animations' styles in the first place. You can use `<noscript />` element to inject required CSS. Here's an example:

```html
<noscript>
  <style type="text/css">
    [data-sal|='fade'] {
      opacity: 1;
    }

    [data-sal|='slide'],
    [data-sal|='zoom'] {
      opacity: 1;
      transform: none;
    }

    [data-sal|='flip'] {
      transform: none;
    }
  </style>
</noscript>
```

## License

Created by [Mirek Ciastek](https://github.com/mciastek). Released under the [MIT License](https://github.com/mciastek/sal/blob/master/LICENSE).
