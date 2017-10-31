const { expect } = require('chai');

const isNativeObject = require('../../../src/internals/isNativeObject');

describe.only('isNativeObject', () => {
  it('Should return false for non objects', () => {
    expect(isNativeObject(null)).to.equal(false);
    expect(isNativeObject(undefined)).to.equal(false);
    expect(isNativeObject(33)).to.equal(false);
    expect(isNativeObject('test')).to.equal(false);
  });

  it('Should return false for user defined objects', () => {
    const a = {};
    const b = Object.create(a);

    expect(isNativeObject(a)).to.equal(false);
    expect(isNativeObject(a)).to.equal(false);
    expect(isNativeObject(b)).to.equal(false);
    expect(isNativeObject(Object.getPrototypeOf(b))).to.equal(false);
    expect(isNativeObject(new Set([1, 2, 4]))).to.equal(false);
    expect(isNativeObject([])).to.equal(false);
    expect(isNativeObject(String('Sta je ovo'))).to.equal(false);
  });

  it.only('Should return true for native objects', () => {
    expect(isNativeObject(Object.prototype)).to.equal(true);
    expect(isNativeObject(Number.prototype)).to.equal(true);
    expect(isNativeObject(Array.prototype)).to.equal(true);
    expect(isNativeObject(Function.prototype)).to.equal(true);
    expect(isNativeObject(Set.prototype)).to.equal(true);

    expect(isNativeObject(Object.getPrototypeOf({}))).to.equal(true);
    expect(isNativeObject(Object.getPrototypeOf(String('ala')))).to.equal(true);
    expect(isNativeObject(Object.getPrototypeOf(Number(33)))).to.equal(true);
  });
});
