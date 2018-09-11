# Sal [![npm version](https://badge.fury.io/js/sal.js.svg)](https://www.npmjs.com/package/sal.js) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/mciastek/sal/blob/master/LICENSE) [![Build Status](https://travis-ci.org/mciastek/sal.svg?branch=master)](https://travis-ci.org/mciastek/sal)

Performance focused, lightweight (less than **2.8 kb**) scroll animation library, written in vanilla JavaScript. No dependencies!

**Sal** (_Scroll Animation Library_) was created to provide a performant and lightweight solution for animating elements on scroll. It's based on the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which gives amazing performance in terms of checking the element's presence in the viewport.

**Note:** Intersection Observer API is an experimental technology so be sure to consult the [browser compatibility table](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Browser_compatibility) and consider using a [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Animations](#animations)
- [Options](#options)
- [API](#api)
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
- `data-sal-duration` - changes duration of the animation
- `data-sal-delay` - adds delay to the animation
- `data-sal-easing` - sets easing for the animation

For example:
```html
<div
  data-sal="slide-up"
  data-sal-delay="300"
  data-sal-easing="ease-out-bounce"
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

## Options

| Property | Type | Description | Default  |
|---------------------------|-------------|---------------|---------|
| `threshold` | Number | Percentage of an element's area that needs to be visible to launch animation (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)) | `0.5` |
| `once` | Boolean | Defines if animation needs to be launched once | `true` |
| `disable` | Boolean | Flag for disabling animations | `false` |

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
| `selector` | String | Selector of the elements to be animated | `[data-sal]` |
| `animateClassName` | String | Class name which triggers animation | `sal-animate` |
| `disabledClassName` | String | Class name which defines the disabled state | `sal-disabled` |
| `rootMargin` | String | Corresponds to root's bounding box margin (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)) | `0% 50%` |

## API

| Method name | Description |
|---------------------------|-------------|
| `enable` | Enables animations |
| `disable` | Disables animations |

Public methods are available after Sal's initialization:

```js
const scrollAnimations = sal();

scrollAnimations.disable();
```

## License

Created by [Mirosław Ciastek](https://github.com/mciastek). Released under the [MIT License](https://github.com/mciastek/sal/blob/master/LICENSE).
