import sal from '../src/sal';

const browser = require('./config/browser');

describe('Sal', () => {
  describe('unit', () => {
    it('is defined', () => {
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
  });
});

