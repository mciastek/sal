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
    const SELECTOR = '.item';
    const FIRST_ITEM_SELECTOR = '.item--1';
    const FIFTH_ITEM_SELECTOR = '.item--5';

    beforeEach((done) => {
      browser.setUp(done);
    });

    afterEach(() => {
      browser.close();
    });

    it('should return elements after init', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

      await page.waitFor(SELECTOR);

      const elementsLength = await page.$$eval(SELECTOR, (elements) => (
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

      await page.waitFor(SELECTOR);

      const firstIsAnimated = await page.$eval(FIRST_ITEM_SELECTOR, (el) => (
        new Promise((resolve) => {
          setTimeout(() => (
            resolve(el.classList.contains('sal-animate'))
          ), 100);
        })
      ));

      expect(firstIsAnimated).toBeTruthy();
    }));

    it('should animate 5th element', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

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
      }, FIFTH_ITEM_SELECTOR);

      expect(fifthIsAnimated).toBeTruthy();
    }));

    it('should disable animations', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

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
      }, FIFTH_ITEM_SELECTOR);

      const bodyHasDisabledClass = await page.evaluate(() => (
        document.body.classList.contains('sal-disabled')
      ));

      expect(fifthIsAnimated).toBeFalsy();
      expect(bodyHasDisabledClass).toBeTruthy();
    }));

    it('should enable animations after disabled', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/default.html`);

      await page.waitFor(SELECTOR);

      const fifthIsAnimated = await page.evaluate((selector) => {
        const fifthItem = document.querySelector(selector);

        window.scrollAnimations.disable();
        window.scrollAnimations.enable();

        const fifthPosY = fifthItem.getBoundingClientRect().top + window.scrollY;
        window.scrollBy(0, fifthPosY);

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fifthItem.classList.contains('sal-animate'));
          }, 100);
        });
      }, FIFTH_ITEM_SELECTOR);

      const bodyHasDisabledClass = await page.evaluate(() => (
        document.body.classList.contains('sal-disabled')
      ));

      expect(fifthIsAnimated).toBeTruthy();
      expect(bodyHasDisabledClass).toBeFalsy();
    }));

    it('should reverse animation on leave', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/repeat.html`);

      await page.waitFor(SELECTOR);

      const firstIsAnimated = await page.evaluate((selector) => {
        const firstItem = document.querySelector(selector);

        window.scrollBy(0, window.innerHeight);

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(firstItem.classList.contains('sal-animate'));
          }, 100);
        });
      }, FIRST_ITEM_SELECTOR);

      expect(firstIsAnimated).toBeFalsy();
    }));

    it('should not launch animation when disabled', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/disabled.html`);

      await page.waitFor(SELECTOR);

      const firstIsAnimated = await page.$eval(SELECTOR, (el) => (
        el.classList.contains('sal-animate')
      ));

      const bodyHasDisabledClass = await page.evaluate(() => (
        document.body.classList.contains('sal-disabled')
      ));

      expect(firstIsAnimated).toBeFalsy();
      expect(bodyHasDisabledClass).toBeTruthy();
    }));

    describe('events', () => {
      it('should fire enter event', browser.run(async (engine, opts) => {
        const page = await engine.newPage();
        await page.goto(`${opts.rootUrl}/default.html`);

        await page.waitFor(SELECTOR);

        const eventFiredOnFifth = await page.evaluate((selector) => {
          const fifthItem = document.querySelector(selector);
          const promise = new Promise((resolve) => {
            fifthItem.addEventListener('sal:in', () => {
              resolve(true);
            });
          });

          const posY = fifthItem.getBoundingClientRect().top + window.scrollY;
          window.scrollBy(0, posY);

          return promise;
        }, FIFTH_ITEM_SELECTOR);

        expect(eventFiredOnFifth).toBeTruthy();
      }));

      it('should fire exit event', browser.run(async (engine, opts) => {
        const page = await engine.newPage();
        await page.goto(`${opts.rootUrl}/repeat.html`);

        await page.waitFor(SELECTOR);

        const eventFiredAtLeastOnce = await page.evaluate(() => {
          const promise = new Promise((resolve) => {
            document.addEventListener('sal:out', () => {
              resolve(true);
            });
          });

          window.scrollBy(0, document.body.scrollHeight);

          return promise;
        });

        expect(eventFiredAtLeastOnce).toBeTruthy();
      }));
    });

    describe('reset', () => {
      it('should animate only selected elements', browser.run(async (engine, opts) => {
        const page = await engine.newPage();
        await page.goto(`${opts.rootUrl}/reset.html`);

        await page.waitFor(SELECTOR);

        await page.waitFor(100);

        await page.evaluate(async () => {
          const animated = Array.from(document.querySelectorAll('.item:not(.after-reset)'));
          window.scrollTo(0, animated[1].offsetTop);
        });

        await page.waitFor(100);

        await page.evaluate(() => {
          const animated = Array.from(document.querySelectorAll('.item:not(.after-reset)'));
          window.scrollTo(0, animated[2].offsetTop);
        });

        await page.waitFor(100);

        const animatedNumber = await page.$$eval('.sal-animate:not(.after-reset)', (items) => (
          items.length
        ));

        expect(animatedNumber).toBe(3);
      }));

      describe('when settings are changed', () => {
        it('should apply new settings', browser.run(async (engine, opts) => {
          const page = await engine.newPage();
          await page.goto(`${opts.rootUrl}/reset.html`);

          await page.waitFor(SELECTOR);

          await page.evaluate(() => {
            window.scrollAnimations.reset({
              selector: '[data-sal].after-reset',
            });
          });

          await page.evaluate(() => {
            const animated = Array.from(document.querySelectorAll('.item.after-reset'));
            window.scrollTo(0, animated[0].offsetTop);
          });

          await page.waitFor(100);

          await page.evaluate(() => {
            const animated = Array.from(document.querySelectorAll('.item.after-reset'));
            window.scrollTo(0, animated[1].offsetTop);
          });

          await page.waitFor(100);

          const animatedNumber = await page.$$eval('.after-reset.sal-animate', (items) => (
            items.length
          ));

          expect(animatedNumber).toBe(2);
        }));
      });
    });
  });
});

/* eslint-enable */
