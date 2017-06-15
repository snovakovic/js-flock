const expect = require('chai').expect;
const deepFreeze = require('../src/deepFreeze');


describe('deepFreeze', () => {
  it('Should deep freeze nested objects', () => {
    const obj = deepFreeze({
      first: {
        second: {
          third: { num: 11, fun() {} }
        }
      }
    });

    expect(Object.isFrozen(obj.first.second)).to.equal(true);
    expect(Object.isFrozen(obj.first.second.third)).to.equal(true);
    expect(Object.isFrozen(obj.first.second.third.fun)).to.equal(true);
  });

  it('Should handle circular reference', () => {
    const ob1 = { first: { test: 1 } };
    const ob2 = { second: { test: 2 } };

    // Create circular reference
    ob2.ob1 = ob1;
    ob1.ob2 = ob2;

    deepFreeze(ob1);

    expect(Object.isFrozen(ob1.first)).to.equal(true);
    expect(Object.isFrozen(ob1.ob2)).to.equal(true);
    expect(Object.isFrozen(ob1.ob2.second)).to.equal(true);
  });
});
