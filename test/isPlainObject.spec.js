const expect = require('chai').expect;
const isPlainObject = require('../src/internals/isPlainObject');


describe('isPLainObject', () => {
  it('Should return true', () => {
    expect(isPlainObject({})).to.be.equal(true);
    expect(isPlainObject({ test: 'test' })).to.be.equal(true);
    expect(isPlainObject(Object.create(null))).to.be.equal(true);
    expect(isPlainObject(Object.create({ test: 'test' }))).to.be.equal(true);
  });

  it('Should return false for type of object that is not plain object', () => {
    expect(isPlainObject(null)).to.be.equal(false);
    expect(isPlainObject([])).to.be.equal(false);
    expect(isPlainObject(new Set())).to.be.equal(false);
    expect(isPlainObject(new Map())).to.be.equal(false);
    expect(isPlainObject(() => { })).to.be.equal(false);
    expect(isPlainObject(Number(1))).to.be.equal(false);
    expect(isPlainObject(String('1'))).to.be.equal(false);
  });

  it('Should return false for not object types', () => {
    expect(isPlainObject(1)).to.be.equal(false);
    expect(isPlainObject(undefined)).to.be.equal(false);
    expect(isPlainObject('test')).to.be.equal(false);
  });
});
