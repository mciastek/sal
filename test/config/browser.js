// eslint-disable-next-line max-len
// see: https://medium.com/@ivanmontiel/using-that-headless-chrome-youve-been-hearing-about-543a8cc07af5

const puppeteer = require('puppeteer');
const path = require('path');

const options = {
  rootUrl: `file://${path.resolve(__dirname, '..', 'fixtures')}`,
  puppeteer: {
    args: ['--no-sandbox'],
  },
};

/**
 * This is a thin wrapper so that we use a singleton of
 * the browser that puppeteer creates
 */
class Browser {
  setUp(done) {
    const puppeteerOpts = options.puppeteer ? options.puppeteer : {};

    puppeteer.launch(puppeteerOpts).then(async (browser) => {
      this.setBrowser(browser);
      done();
    });
  }

  setBrowser(browser) {
    this.browser = browser;
    const oldNewPage = this.browser.newPage.bind(this.browser);

    this.browser.newPage = async function () {
      const page = await oldNewPage();
      this.lastPage = page;
      return page;
    };
  }

  run(promise) {
    return (done) => {
      promise(this.browser, options)
        .then(() => done()).catch(done);
    };
  }
}
/*
 * Create a new browser and use a proxy to pass
 * any puppeteer calls to the inner browser
 */
module.exports = new Proxy(new Browser(), {
  get: (target, name) => (
    (name in target) ? target[name].bind(target) : target.browser[name]
  ),
});
