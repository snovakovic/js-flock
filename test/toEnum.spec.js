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
    const notObjectOrArray = 'Provided argument need to be object or array';
    const onlyStrings = 'Only strings are allowed in array notation';
    expect(() => toEnum(33)).to.throw(TypeError);
    expect(() => toEnum(null)).to.throw(TypeError, notObjectOrArray);
    expect(() => toEnum(['first', 33])).to.throw(TypeError, onlyStrings);
  });

  it('Should freeze values and keys', () => {
    const testEnum = toEnum(enumArray);

    const values = testEnum.values();
    const keys = testEnum.keys();

    values[0] = 'changed value';
    keys[0] = 'changed key';

    expect(testEnum.values()).to.eql(enumArray);
    expect(testEnum.keys()).to.eql(enumArray);
  });

  it('Should not fail for empty array/object', () => {
    const en1 = toEnum({});
    const en2 = toEnum({});
    expect(en1.keys()).to.eql([]);
    expect(en2.values()).to.eql([]);
  });

  it('Should handle helper functions', () => {
    const testEnum = toEnum({
      CAR: 'CAR',
      TRUCK: 'TRUCK',
      AIRPLANE: 'AIRPLANE',
      HELICOPTER: 'HELICOPTER',
      canFly(type) {
        return type === this.AIRPLANE || type === this.HELICOPTER;
      }
    });

    const canFly = testEnum.canFly;
    expect(testEnum.canFly(testEnum.HELICOPTER)).to.equal(true);
    expect(testEnum.canFly(testEnum.AIRPLANE)).to.equal(true);
    expect(testEnum.canFly(testEnum.TRUCK)).to.equal(false);
    expect(testEnum.canFly(null)).to.equal(false);
    expect(canFly(testEnum.HELICOPTER)).to.equal(true);

    expect(testEnum.haveKey('canFly')).to.equal(false);
    expect(testEnum.exists('canFly')).to.equal(false);

    const values = ['CAR', 'TRUCK', 'AIRPLANE', 'HELICOPTER'];
    expect(testEnum.values()).to.eql(values);
    expect(testEnum.keys()).to.eql(values);
  });
});
