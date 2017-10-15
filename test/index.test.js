/* eslint-disable max-len */

import sal from '../src/sal';

const browser = require('./config/browser');

describe('Sal', () => {
  describe('unit', () => {
    it('should be defined', () => {
      expect(sal).toBeDefined();
      expect(sal).toBeInstanceOf(Function);
    });
  });

  describe('browser', () => {
    beforeEach((done) => {
      browser.setUp(done);
    });

    afterEach(() => {
      browser.close();
    });

    it('should return elements after init', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

      const SELECTOR = '.item';
      await page.waitFor(SELECTOR);

      const elementsLength = await page.$$eval(SELECTOR, elements => (
        elements.length
      ));

      const salElementsLength = await page.evaluate(() => (
        window.scrollAnimations.elements.length
      ));

      expect(elementsLength).toBe(salElementsLength);
    }));

    it('should animate first element', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

      const SELECTOR = '.item';
      await page.waitFor(SELECTOR);

      const firstIsAnimated = await page.$eval(SELECTOR, el => (
        el.classList.contains('sal-animate')
      ));

      expect(firstIsAnimated).toBeTruthy();
    }));

    it('should animate 5th element', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

      const SELECTOR = '.item--5';
      await page.waitFor(SELECTOR);

      const fifthIsAnimated = await page.evaluate((selector) => {
        const fifthItem = document.querySelector(selector);
        const posY = fifthItem.getBoundingClientRect().top + window.scrollY;
        window.scrollBy(0, posY);

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fifthItem.classList.contains('sal-animate'));
          }, 100);
        });
      }, SELECTOR);

      expect(fifthIsAnimated).toBeTruthy();
    }));

    it('should disable animations', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

      const SELECTOR = '.item--5';
      await page.waitFor(SELECTOR);

      const fifthIsAnimated = await page.evaluate((selector) => {
        window.scrollAnimations.disable();
        const fifthItem = document.querySelector(selector);
        const posY = fifthItem.getBoundingClientRect().top + window.scrollY;
        window.scrollBy(0, posY);

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fifthItem.classList.contains('sal-animate'));
          }, 100);
        });
      }, SELECTOR);

      expect(fifthIsAnimated).toBeFalsy();
    }));

    it('should enable animations after disabled', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

      const SELECTOR = '.item';
      await page.waitFor(SELECTOR);

      const SECOND_ITEM_SELECTOR = '.item--2';
      const FIFTH_ITEM_SELECTOR = '.item--2';

      const fifthIsAnimated = await page.evaluate((secondSelector, fifthSelector) => {
        window.scrollAnimations.disable();
        const secondItem = document.querySelector(secondSelector);
        const fifthItem = document.querySelector(fifthSelector);

        const secondPosY = secondItem.getBoundingClientRect().top + window.scrollY;
        window.scrollBy(0, secondPosY);

        window.scrollAnimations.enable();

        const fifthPosY = fifthItem.getBoundingClientRect().top + window.scrollY;
        window.scrollBy(0, fifthPosY);

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fifthItem.classList.contains('sal-animate'));
          }, 100);
        });
      }, SECOND_ITEM_SELECTOR, FIFTH_ITEM_SELECTOR);

      expect(fifthIsAnimated).toBeFalsy();
    }));
  });
});

/* eslint-enable */
