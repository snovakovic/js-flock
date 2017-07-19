const expect = require('chai').expect;
const deepFreeze = require('../src/deepFreeze');
const deepSeal = require('../src/deepSeal');


describe('deepSealOrFreeze', () => {
  let obj;
  let circ1;
  let circ2;

  beforeEach(() => {
    obj = {
      first: {
        second: {
          third: { num: 11, fun() {} }
        }
      }
    };

    circ1 = { first: { test: 1 } };
    circ2 = { second: { test: 2 } };

    // Create circular reference
    circ2.circ1 = circ1;
    circ1.circ2 = circ2;
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
      const ob1 = { proto: { test: { is: 1 } } };
      const ob2 = Object.create(ob1);
      ob2.child = { test: 1 };

      deepFreeze(ob2);
      expect(Object.isFrozen(ob2)).to.equal(true);
      expect(Object.isFrozen(ob2.child)).to.equal(true);
      expect(Object.isFrozen(ob2.proto)).to.equal(false);
      expect(Object.isFrozen(ob2.proto.test)).to.equal(false);
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
});
