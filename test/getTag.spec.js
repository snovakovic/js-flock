const expect = require('chai').expect;
const getTag = require('../src/internals/getTag');


describe('getTag', () => {
  it('Should return correct tag', () => {
    expect(getTag({})).to.equal('[object Object]');
    expect(getTag([])).to.equal('[object Array]');
    expect(getTag(new Set())).to.equal('[object Set]');
    expect(getTag(new WeakSet())).to.equal('[object WeakSet]');
    expect(getTag(new Map())).to.equal('[object Map]');
    expect(getTag(new WeakMap())).to.equal('[object WeakMap]');
    expect(getTag(undefined)).to.equal('[object Undefined]');
    expect(getTag(null)).to.equal('[object Null]');
    expect(getTag(3)).to.equal('[object Number]');
    expect(getTag(Number('ss'))).to.equal('[object Number]');
    expect(getTag('ss')).to.equal('[object String]');
    expect(getTag(String(33))).to.equal('[object String]');
    expect(getTag(false)).to.equal('[object Boolean]');
    expect(getTag(() => {})).to.equal('[object Function]');
  });
});
