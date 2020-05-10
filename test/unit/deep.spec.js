const { assert } = require('chai');
const deepFreeze = require('../../src/deepFreeze');
const deepSeal = require('../../src/deepSeal');
const deepPreventExtensions = require('../../src/deepPreventExtensions');

describe('deep', () => {
  let obj;
  let circ1;
  let circ2;
  let proto;

  beforeEach(() => {
    obj = {};
    obj.first = {
      second: { third: { num: 11, fun() {} } },
    };

    circ1 = { first: { test: 1 } };
    circ2 = { second: { test: 2 } };

    // Create circular reference
    circ2.circ1 = circ1;
    circ1.circ2 = circ2;

    const ob1 = { proto: { test: { is: 1 } } };
    const ob2 = Object.create(ob1);
    ob2.ob2Prop = { prop: 'prop' };
    proto = Object.create(ob2);
    proto.child = { test: 1 };
    proto.fun = () => {};
  });

  describe('deepFreeze', () => {
    it('Should deep freeze nested objects', () => {
      deepFreeze(obj);
      assert.equal(Object.isFrozen(obj.first.second), true);
      assert.equal(Object.isFrozen(obj.first.second.third), true);
      assert.equal(Object.isFrozen(obj.first.second.third.fun), true);
    });

    it('Should handle circular reference', () => {
      deepFreeze(circ1);
      assert.equal(Object.isFrozen(circ1.first), true);
      assert.equal(Object.isFrozen(circ1.circ2), true);
      assert.equal(Object.isFrozen(circ1.circ2.second), true);
    });

    it('Should not freeze prototype chain', () => {
      deepFreeze(proto);
      assert.equal(Object.isFrozen(proto), true);
      assert.equal(Object.isFrozen(proto.child), true);
      assert.equal(Object.isFrozen(proto.function), true);
      assert.equal(Object.isFrozen(proto.ob2Prop), false);
      assert.equal(Object.isFrozen(proto.proto.test), false);
    });

    it('Should not break on invalid options', () => {
      deepFreeze(obj, null);
      assert.equal(Object.isFrozen(obj), true);
    });

    it('Should not brake on restricted properties', () => {
      const fun = function() { };
      const funPrototype = Object.getPrototypeOf(fun);
      deepFreeze(funPrototype);
      assert.equal(Object.isFrozen(funPrototype), true);
    });

    it('Should deep freeze object with null prototype', () => {
      const ob1 = Object.create(null);
      ob1.test = 'test';
      ob1.ob2 = Object.create(null);

      deepFreeze(ob1);
      assert.equal(Object.isFrozen(ob1), true);
      assert.equal(Object.isFrozen(ob1.ob2), true);
    });

    it('Should deep freeze object with null prototype and proto option', () => {
      const ob1 = Object.create(null);
      ob1.ob2 = Object.create(null);

      deepFreeze(ob1, { proto: true });
      assert.equal(Object.isFrozen(ob1), true);
      assert.equal(Object.isFrozen(ob1.ob2), true);
    });

    it('Should deep freeze complex object', () => {
      const fun = () => {};
      const arr = [{ prop: { prop2: 1 } }];
      const set = new Set([{ prop: { prop2: 1 } }]);
      const ob = { arr, fun, set };

      fun.test = { prop: { prop2: 1 } };
      arr.test = { prop: { prop2: 1 } };
      set.test = { prop: { prop2: 1 } };

      deepFreeze(ob);
      assert.equal(Object.isFrozen(ob), true);
      assert.equal(Object.isFrozen(ob.fun), true);
      assert.equal(Object.isFrozen(ob.fun.test), true);
      assert.equal(Object.isFrozen(ob.arr), true);
      assert.equal(Object.isFrozen(ob.arr.test), true);
      assert.equal(Object.isFrozen(ob.arr.test), true);
      assert.equal(Object.isFrozen(ob.set), true);
      assert.equal(Object.isFrozen(ob.set.test), true);
    });

    it('Should deep freeze non enumerable properties', () => {
      Object.defineProperty(obj, 'nonEnumerable', {
        enumerable: false,
        value: {},
      });

      deepFreeze(obj);
      assert.equal(Object.isFrozen(obj.nonEnumerable), true);
    });

    it('Should validate readme examples', () => {
      const person = {
        fullName: 'test person',
        dob: new Date(),
        address: {
          country: 'Croatia',
          city: 'this one',
        },
      };

      Object.freeze(person);
      assert.equal(Object.isFrozen(person), true);
      assert.equal(Object.isFrozen(person.address), false);

      deepFreeze(person);
      assert.equal(Object.isFrozen(person), true);
      assert.equal(Object.isFrozen(person.address), true);

      const ob1 = { test: { a: 'a' } };
      const ob2 = Object.create(ob1);

      deepFreeze(ob2, { proto: true });

      assert.equal(Object.isFrozen(ob2.test), true);
      assert.equal(Object.isFrozen(Object.getPrototypeOf(ob2)), true);
      assert.equal(Object.isFrozen(ob1), true);
      assert.equal(Object.isFrozen(Object.getPrototypeOf(ob1)), false);
    });

    it('Should freeze object with Symbol property', () => {
      const sim = Symbol('test');
      obj[sim] = {
        key: { test: 1 },
      };

      deepFreeze(obj);
      assert.equal(Object.isFrozen(obj[sim].key), true);
    });

    it('Should not break for TypedArray properties', () => {
      obj.typedArray = new Uint32Array(4);
      obj.buffer = Buffer.from('TEST');

      deepFreeze(obj);
      assert.equal(Object.isFrozen(obj), true);
    });

    it('Should deep freeze children of already frozen object', () => {
      Object.freeze(obj.first);

      deepFreeze(obj);
      assert.equal(Object.isFrozen(obj.first.second), true);
      assert.equal(Object.isFrozen(obj.first.second.third), true);
    });

    it('Should not freeze object prototype', () => {
      deepFreeze(proto);
      assert.equal(Object.isFrozen(proto), true);
      assert.equal(Object.isFrozen(Object.getPrototypeOf(proto)), false);
    });

    it('Should freeze object prototype', () => {
      deepFreeze(proto, { proto: true });
      const proto1 = Object.getPrototypeOf(proto);
      const proto2 = Object.getPrototypeOf(proto1);
      const nativeProto = Object.getPrototypeOf(proto2);

      assert.equal(Object.isFrozen(proto), true);
      assert.equal(Object.isFrozen(proto1), true);
      assert.equal(Object.isFrozen(proto2), true);
      assert.equal(Object.isFrozen(nativeProto), false);
    });

    it('Should not freeze excluded property', () => {
      // Freeze this property but don't freeze nested `third property`
      obj.third = { a: 22 };

      deepFreeze(obj, {
        exclude(key, context) {
          return key === 'third' && context !== obj;
        },
      });

      assert.equal(Object.isFrozen(obj.third), true);
      assert.equal(Object.isFrozen(obj.first.second), true);
      // We have exclude this property
      assert.equal(Object.isFrozen(obj.first.second.third), false);
    });

    it('Should not break on invalid exclude option', () => {
      deepFreeze(obj, { exclude: 'third' });
      assert.equal(Object.isFrozen(obj.first.second.third), true);
    });
  });


  describe('deepSeal', () => {
    it('Should deep seal nested objects', () => {
      deepSeal(obj);
      assert.equal(Object.isSealed(obj.first.second), true);
      assert.equal(Object.isSealed(obj.first.second.third), true);
      assert.equal(Object.isSealed(obj.first.second.third.fun), true);
    });

    it('Should handle circular reference', () => {
      deepSeal(circ1);
      assert.equal(Object.isSealed(circ1.first), true);
      assert.equal(Object.isSealed(circ1.circ2), true);
      assert.equal(Object.isSealed(circ1.circ2.second), true);
    });
  });


  describe('deepPreventExtensions', () => {
    it('Should deep prevent extension', () => {
      deepPreventExtensions(obj);
      assert.equal(Object.isExtensible(obj), false);
      assert.equal(Object.isExtensible(obj.first.second), false);
      assert.equal(Object.isExtensible(obj.first.second.third), false);
    });
  });
});
