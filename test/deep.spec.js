const expect = require('chai').expect;
const deepFreeze = require('../src/deepFreeze');
const deepSeal = require('../src/deepSeal');
const deepPreventExtensions = require('../src/deepPreventExtensions');

describe('deep', () => {
  let obj;
  let circ1;
  let circ2;
  let proto;

  beforeEach(() => {
    obj = {};
    obj.first = {
      second: { third: { num: 11, fun() {} } }
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
      expect(Object.isFrozen(obj.first.second)).to.equal(true);
      expect(Object.isFrozen(obj.first.second.third)).to.equal(true);
      expect(Object.isFrozen(obj.first.second.third.fun)).to.equal(true);
    });

    it('Should handle circular reference', () => {
      deepFreeze(circ1);
      expect(Object.isFrozen(circ1.first)).to.equal(true);
      expect(Object.isFrozen(circ1.circ2)).to.equal(true);
      expect(Object.isFrozen(circ1.circ2.second)).to.equal(true);
    });

    it('Should not freeze prototype chain', () => {
      deepFreeze(proto);
      expect(Object.isFrozen(proto)).to.equal(true);
      expect(Object.isFrozen(proto.child)).to.equal(true);
      expect(Object.isFrozen(proto.function)).to.equal(true);
      expect(Object.isFrozen(proto.ob2Prop)).to.equal(false);
      expect(Object.isFrozen(proto.proto.test)).to.equal(false);
    });

    it('Should not break on invalid options', () => {
      deepFreeze(obj, null);
      expect(Object.isFrozen(obj)).to.equal(true);
    });

    it('Should freeze prototype chain', () => {
      deepFreeze(proto, { proto: true });
      expect(Object.isFrozen(proto)).to.equal(true);
      expect(Object.isFrozen(proto.child)).to.equal(true);
      expect(Object.isFrozen(proto.ob2Prop)).to.equal(true);
      expect(Object.isFrozen(proto.proto)).to.equal(true);
      expect(Object.isFrozen(proto.proto.test)).to.equal(true);
    });

    it('should deep freeze complex object', () => {
      const fun = () => {};
      fun.test = { isFrozen: { is: false } };
      const arr = [{ isFrozen: { is: false } }];
      arr.test = { isFrozen: { is: false } };
      const set = new Set([{ isFrozen: { is: false } }]);
      set.test = { isFrozen: { is: false } };
      const ob = { arr, fun, set };

      deepFreeze(ob);
      expect(Object.isFrozen(ob)).to.equal(true);
      expect(Object.isFrozen(ob.fun)).to.equal(true);
      expect(Object.isFrozen(ob.fun.test)).to.equal(true);
      expect(Object.isFrozen(ob.arr)).to.equal(true);
      expect(Object.isFrozen(ob.arr.test)).to.equal(true);
      expect(Object.isFrozen(ob.arr.test)).to.equal(true);
      expect(Object.isFrozen(ob.set)).to.equal(true);
      expect(Object.isFrozen(ob.set.test)).to.equal(true);
    });

    it('Should validate readme examples', () => {
      const person = {
        fullName: 'test person',
        dob: new Date(),
        address: {
          country: 'testiland',
          city: 'this one'
        }
      };

      Object.freeze(person);
      expect(Object.isFrozen(person)).to.equal(true);
      expect(Object.isFrozen(person.address)).to.equal(false);
      deepFreeze(person);
      expect(Object.isFrozen(person)).to.equal(true);
      expect(Object.isFrozen(person.address)).to.equal(true);

      const ob1 = { test: { a: 'a' } };
      const ob2 = Object.create(ob1);
      deepFreeze(ob2);
      expect(Object.isFrozen(ob2.test)).to.equal(false);
      deepFreeze(ob2, { proto: true });
      expect(Object.isFrozen(ob2.test)).to.equal(true);
    });
  });


  describe('deepSeal', () => {
    it('Should deep seal nested objects', () => {
      deepSeal(obj);
      expect(Object.isSealed(obj.first.second)).to.equal(true);
      expect(Object.isSealed(obj.first.second.third)).to.equal(true);
      expect(Object.isSealed(obj.first.second.third.fun)).to.equal(true);
    });

    it('Should handle circular reference', () => {
      deepSeal(circ1);
      expect(Object.isSealed(circ1.first)).to.equal(true);
      expect(Object.isSealed(circ1.circ2)).to.equal(true);
      expect(Object.isSealed(circ1.circ2.second)).to.equal(true);
    });
  });


  describe('deepPreventExtensions', () => {
    it('Should deep prevent extension', () => {
      deepPreventExtensions(obj);
      expect(Object.isExtensible(obj)).to.equal(false);
      expect(Object.isExtensible(obj.first.second)).to.equal(false);
      expect(Object.isExtensible(obj.first.second.third)).to.equal(false);
    });
  });
});
