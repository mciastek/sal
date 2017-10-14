import sal from '../src/sal';

const browser = require('./config/browser');

describe('SAL', () => {
  beforeEach((done) => {
    browser.setUp(done);
  });

  afterEach(() => {
    browser.close();
  });

  it('works', () => {
    expect(sal).toBeDefined();
  });
});
