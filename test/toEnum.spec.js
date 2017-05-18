const expect = require('chai').expect;
const toEnum = require('../src/toEnum');


describe('toEnum', () => {
  let enumArray;
  beforeEach(() => {
    enumArray = ['first', 'second'];
  });

  it('Should convert normal object to Enum representation', () => {
    const testEnum = toEnum({
      first: 1,
      second: 2
    });

    expect(Object.isFrozen(testEnum)).to.equal(true);
    expect(testEnum.first).to.equal(1);
    expect(testEnum.second).to.equal(2);
    expect(testEnum.values()).to.eql([1, 2]);
    expect(testEnum.keys()).to.eql(enumArray);
    expect(testEnum.exists(1)).to.eql(true);
    expect(testEnum.exists('1')).to.eql(false);
    expect(testEnum.haveKey('first')).to.eql(true);
    expect(testEnum.haveKey('third')).to.eql(false);
  });

  it('Should convert array representation to Enum representation', () => {
    const testEnum = toEnum(enumArray);

    expect(Object.isFrozen(testEnum)).to.equal(true);
    expect(testEnum.first).to.equal('first');
    expect(testEnum.second).to.equal('second');
    expect(testEnum.values()).to.eql(enumArray);
    expect(testEnum.keys()).to.eql(enumArray);
    expect(testEnum.exists(1)).to.eql(false);
    expect(testEnum.exists('first')).to.eql(true);
    expect(testEnum.haveKey('first')).to.eql(true);
    expect(testEnum.haveKey('third')).to.eql(false);
  });

  it('Should fail for invalid arguments', () => {
    expect(() => toEnum(33)).to.throw(TypeError);
    expect(() => toEnum(null)).to.throw(TypeError, 'Provided argument need to be object or array');
    expect(() => toEnum(['first', undefined])).to.throw(TypeError, 'Only strings are allowed in array notation');
  });

  it('Values and keys should be immutable', () => {
    const testEnum = toEnum(enumArray);

    const values = testEnum.values();
    const keys = testEnum.keys();

    values[0] = 'changed value';
    keys[0] = 'changed key';

    expect(testEnum.values()).to.eql(enumArray);
    expect(testEnum.keys()).to.eql(enumArray);
  });
});
