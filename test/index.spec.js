const expect = require('chai').expect;
const jsFlock = require('../src/index');


describe('index', () => {
  it('should load all modules', () => {
    expect(jsFlock.promisify).to.be.a('function');
    expect(jsFlock.collar).to.be.a('function');
    expect(jsFlock.toEnum).to.be.a('function');
    expect(jsFlock.deepFreeze).to.be.a('function');
    expect(jsFlock.deepSeal).to.be.a('function');
  });
});
