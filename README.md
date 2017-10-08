# Sal [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/mciastek/sal/blob/master/LICENSE) [![Build Status](https://travis-ci.org/mciastek/sal.svg?branch=master)](https://travis-ci.org/mciastek/sal)

Highly performant, lightweight (less than **1 kb**) scroll animation library, written in vanilla JavaScript. No dependencies!

**Sal** (_Scroll Animation Library_) is written with aim to provide performant and lightweight solution for animating elements on scroll. It's based on the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which gives amazing performance in terms of checking the element's presence in viewport.

## Table of Contents
- [Install](#install)

## Install

```sh
# Usage with NPM
$ npm install --save sal

# and with Yarn
$ yarn add sal
```

Then load it with your favorite module loader

```js
// ES6 modules
import sal from 'sal'

// CommonJS modules
var sal = require('sal')
```
