# Sal [![npm version](https://badge.fury.io/js/sal.js.svg)](https://www.npmjs.com/package/sal.js) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/mciastek/sal/blob/master/LICENSE) [![Build Status](https://travis-ci.org/mciastek/sal.svg?branch=master)](https://travis-ci.org/mciastek/sal)

Performance focused, lightweight (less than **2.5 kb**) scroll animation library, written in vanilla JavaScript. No dependencies!

**Sal** (_Scroll Animation Library_) is written with aim to provide performant and lightweight solution for animating elements on scroll. It's based on the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which gives amazing performance in terms of checking the element's presence in viewport.

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

Then load it with your favorite module loader or use as global, when no modules

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

In HTML, add `data-sal`, which value is animation name, e.g.:

```html
<div data-sal="<animation-name>"></div>
```

Then simply init Sal in your script file:

```js
sal();
```

It will look for an element with `data-sal` attribute and launch animation, when it's in viewport.

## Animations
With **sal.js** you can easily change animation's options, by adding a proper `data` attribute:
- `data-sal-duration` - changes animation's duration
- `data-sal-delay` - adds delay to animation
- `data-sal-easing` - sets easing for the animation

For example:
```html
<div
  data-sal="slide-up"
  data-sal-delay='300'
  data-sal-easing='ease-out-bounce'
></div>
```

Library supports several animations:
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
| `threshold` | Number | Percentage of element's area that needs to be visible to launch animation (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)) | 0.5 |
| `once` | Boolean | Defines if animation needs to be launched once | true |
| `disable` | Boolean | Flag for disabling animations | false |

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
| `selector` | String | Selector of element, which should be animated | [data-sal] |
| `animateClassName` | String | Class name which triggers animation | sal-animate |
| `disabledClassName` | String | Class name which defines disable state | sal-disabled |
| `rootMargin` | String | Corresponds to root's bounding box margin (see [docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)) | 0% 50% |

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

Created by [Mirosław Ciastek](github.com/mciastek). Released under the [MIT License](https://github.com/mciastek/sal/blob/master/LICENSE).
