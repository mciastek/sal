/* eslint-disable max-len */

import sal from '../src/sal';

const browser = require('./config/browser');

describe('Sal', () => {
  const MockIntersectionObserver = jest.fn();

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });

  describe('unit', () => {
    it('should be defined', () => {
      expect(sal).toBeDefined();
      expect(sal).toBeInstanceOf(Function);
    });

    it('returns public methods', () => {
      const instance = sal();

      expect(Object.keys(instance)).toEqual([
        'elements',
        'disable',
        'enable',
        'reset',
        'update',
      ]);
    });

    it('passes all options to IntersectionObserver', () => {
      const dummyRoot = document.createElement('div');
      const instance = sal({
        root: dummyRoot,
        rootMargin: '50% 50%',
        threshold: 1,
      });

      expect(instance).toBeDefined();
      expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        root: dummyRoot,
        rootMargin: '50% 50%',
        threshold: 1,
      });
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

      await page.waitForSelector(SELECTOR);

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

      await page.waitForSelector(SELECTOR);

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

      await page.waitForSelector(SELECTOR);

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

      await page.waitForSelector(SELECTOR);

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

      await page.waitForSelector(SELECTOR);

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

      await page.waitForSelector(SELECTOR);

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

    describe('[data-sal-repeat]', () => {
      it('should reverse animation on leave', browser.run(async (engine, opts) => {
        const page = await engine.newPage();
        await page.goto(`${opts.rootUrl}/repeat-once-attr.html`);

        await page.waitForSelector(SELECTOR);

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
    });

    describe('[data-sal-once]', () => {
      it('should not reverse animation on leave', browser.run(async (engine, opts) => {
        const page = await engine.newPage();
        await page.goto(`${opts.rootUrl}/repeat-once-attr.html`);

        await page.waitForSelector(SELECTOR);

        await page.evaluate(() => {
          window.scrollAnimations.reset({
            once: false,
          });
        });

        await page.evaluate((selector) => {
          const fifthItem = document.querySelector(selector);

          const posY = fifthItem.getBoundingClientRect().top + window.scrollY;
          window.scrollBy(0, posY);
        }, FIFTH_ITEM_SELECTOR);

        await page.waitForTimeout(100);

        const [firstIsAnimated, fifthIsAnimated] = await page.evaluate((firstSelector, fifthSelector) => {
          const firstItem = document.querySelector(firstSelector);
          const fifthItem = document.querySelector(fifthSelector);

          window.scrollBy(0, window.innerHeight);

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve([
                firstItem.classList.contains('sal-animate'),
                fifthItem.classList.contains('sal-animate'),
              ]);
            }, 100);
          });
        }, FIRST_ITEM_SELECTOR, FIFTH_ITEM_SELECTOR);

        expect(firstIsAnimated).toBeFalsy();
        expect(fifthIsAnimated).toBeTruthy();
      }));
    });

    it('should not launch animation when disabled', browser.run(async (engine, opts) => {
      const page = await engine.newPage();
      await page.goto(`${opts.rootUrl}/disabled.html`);

      await page.waitForSelector(SELECTOR);

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

        await page.waitForSelector(SELECTOR);

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

        await page.waitForSelector(SELECTOR);

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

        await page.waitForSelector(SELECTOR);

        await page.waitForTimeout(100);

        await page.evaluate(async () => {
          const animated = Array.from(document.querySelectorAll('.item:not(.after-reset)'));
          window.scrollTo(0, animated[1].offsetTop);
        });

        await page.waitForTimeout(100);

        await page.evaluate(() => {
          const animated = Array.from(document.querySelectorAll('.item:not(.after-reset)'));
          window.scrollTo(0, animated[2].offsetTop);
        });

        await page.waitForTimeout(100);

        const animatedNumber = await page.$$eval('.sal-animate:not(.after-reset)', (items) => (
          items.length
        ));

        expect(animatedNumber).toBe(3);
      }));

      describe('when settings are changed', () => {
        it('should apply new settings', browser.run(async (engine, opts) => {
          const page = await engine.newPage();
          await page.goto(`${opts.rootUrl}/reset.html`);

          await page.waitForSelector(SELECTOR);

          await page.evaluate(() => {
            window.scrollAnimations.reset({
              selector: '[data-sal].after-reset',
            });
          });

          await page.evaluate(() => {
            const animated = Array.from(document.querySelectorAll('.item.after-reset'));
            window.scrollTo(0, animated[0].offsetTop);
          });

          await page.waitForTimeout(100);

          await page.evaluate(() => {
            const animated = Array.from(document.querySelectorAll('.item.after-reset'));
            window.scrollTo(0, animated[1].offsetTop);
          });

          await page.waitForTimeout(100);

          const animatedNumber = await page.$$eval('.after-reset.sal-animate', (items) => (
            items.length
          ));

          expect(animatedNumber).toBe(2);
        }));
      });
    });

    describe('update', () => {
      it('should animated dynamically added elements', browser.run(async (engine, opts) => {
        const page = await engine.newPage();
        await page.goto(`${opts.rootUrl}/update.html`);

        await page.waitForSelector(SELECTOR);

        await page.evaluate(() => {
          const container = document.getElementById('container');
          container.innerHTML += `
            <div class="item item--4" data-sal="slide-left"></div>
            <div class="item item--5" data-sal="slide-right"></div>
          `;

          window.scrollAnimations.update();
        });

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
    });
  });
});

/* eslint-enable */
