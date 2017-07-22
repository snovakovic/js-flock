const expect = require('chai').expect;
const jsFlock = require('../src/index');


describe('index', () => {
  it('should load all modules', () => {
    const modules = ['collar', 'deepFreeze', 'deepPreventExtensions', 'deepSeal', 'promisify',
      'singular', 'sort', 'toEnum'];
    expect(jsFlock).to.include.all.keys(modules);
  });
});
