const expect = require('chai').expect;
const toEnum = require('../src/toEnum');


describe.only('toEnum', () => {
  let arr;
  let obj;

  beforeEach(() => {
    obj = {};
    arr = ['CAR', 'TRUCK', 'AIRPLANE', 'HELICOPTER'];
    arr.forEach((key) => (obj[key] = key));
  });

  it('Should convert normal object to Enum representation', () => {
    const testEnum = toEnum(obj);
    expect(Object.isFrozen(testEnum)).to.equal(true);
    expect(testEnum.values()).to.eql(arr);
    expect(testEnum.keys()).to.eql(arr);
    expect(testEnum.exists('CAR')).to.eql(true);
    expect(testEnum.exists('1')).to.eql(false);
    expect(testEnum.haveKey('CAR')).to.eql(true);
    expect(testEnum.haveKey('car')).to.eql(false);
  });

  it('Should convert arr representation to Enum representation', () => {
    const testEnum = toEnum(arr);
    expect(Object.isFrozen(testEnum)).to.equal(true);
    expect(testEnum.CAR).to.be.a('symbol');
    expect(testEnum.TRUCK).to.be.a('symbol');
    expect(testEnum).to.include.all.keys(['values', 'keys', 'haveKey', 'exists']);
  });

  it('Should freeze values and keys', () => {
    const testEnum = toEnum(arr);
    const values = testEnum.values();
    const keys = testEnum.keys();
    keys[0] = 'changed key';
    expect(Object.isFrozen(values)).to.equal(true);
    expect(testEnum.keys()).to.eql(arr);
  });

  it('Should handle helper functions', () => {
    obj.canFly = function(type) { return type === this.AIRPLANE || type === this.HELICOPTER; };
    const testEnum = toEnum(obj);
    expect(testEnum.canFly(testEnum.HELICOPTER)).to.equal(true);
    expect(testEnum.canFly(testEnum.AIRPLANE)).to.equal(true);
    expect(testEnum.canFly(testEnum.TRUCK)).to.equal(false);
    expect(testEnum.canFly(null)).to.equal(false);
    expect(testEnum.haveKey('canFly')).to.equal(false);
    expect(testEnum.exists('canFly')).to.equal(false);
    const values = ['CAR', 'TRUCK', 'AIRPLANE', 'HELICOPTER'];
    expect(testEnum.values()).to.eql(values);
    expect(testEnum.keys()).to.eql(values);
  });

  it('Should throw exception for duplicate values', () => {
    obj.boat = 'CAR';
    expect(() => toEnum(obj)).to.throw(TypeError, 'toEnum: Duplicate values detected');
  });

  it('Invalid input should return empty enum', () => {
    const testEnum = toEnum('invalid');
    expect(testEnum.values()).to.eql([]);
    expect(testEnum.keys()).to.eql([]);
  });
});
