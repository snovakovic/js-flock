const { assert } = require('chai');
const toEnum = require('../../src/toEnum');

describe('toEnum', () => {
  let arr;
  let obj;

  beforeEach(() => {
    obj = {};
    arr = ['CAR', 'TRUCK', 'AIRPLANE', 'HELICOPTER'];
    arr.forEach(key => obj[key] = key);
  });

  it('Should convert normal object to Enum representation', () => {
    const testEnum = toEnum(obj);

    assert.isTrue(Object.isFrozen(testEnum));
    assert.deepEqual(testEnum.values(), arr);
    assert.deepEqual(testEnum.keys(), arr);
    assert.isTrue(testEnum.exists('CAR'));
    assert.isFalse(testEnum.exists('1'));
    assert.isTrue(testEnum.haveKey('CAR'));
    assert.isFalse(testEnum.haveKey('car'));
  });

  it('Should convert arr representation to Enum representation', () => {
    const testEnum = toEnum(arr);

    assert.isTrue(Object.isFrozen(testEnum));
    assert.typeOf(testEnum.CAR, 'symbol');
    assert.typeOf(testEnum.TRUCK, 'symbol');
    assert.containsAllKeys(testEnum, ['values', 'keys', 'haveKey', 'exists']);
  });

  it('Should freeze values and keys', () => {
    const testEnum = toEnum(arr);
    const values = testEnum.values();
    const keys = testEnum.keys();

    keys[0] = 'changed key';

    assert.isTrue(Object.isFrozen(values));
    assert.deepEqual(testEnum.keys(), arr);
  });

  it('Should handle helper functions', () => {
    obj.canFly = function(type) {
      return type === this.AIRPLANE || type === this.HELICOPTER;
    };

    const testEnum = toEnum(obj);
    assert.isTrue(testEnum.canFly(testEnum.HELICOPTER));
    assert.isTrue(testEnum.canFly(testEnum.AIRPLANE));
    assert.isFalse(testEnum.canFly(testEnum.TRUCK));
    assert.isFalse(testEnum.canFly(null));
    assert.isFalse(testEnum.haveKey('canFly'));
    assert.isFalse(testEnum.exists('canFly'));

    const values = ['CAR', 'TRUCK', 'AIRPLANE', 'HELICOPTER'];
    assert.deepEqual(testEnum.values(), values);
    assert.deepEqual(testEnum.keys(), values);
  });

  it('Should throw exception for duplicate values', () => {
    obj.boat = 'CAR';
    assert.throws(() => toEnum(obj), TypeError, 'toEnum: Duplicate values detected');
  });

  it('Invalid input should return empty enum', () => {
    const testEnum = toEnum('invalid');

    assert.deepEqual(testEnum.values(), []);
    assert.deepEqual(testEnum.keys(), []);
  });
});
