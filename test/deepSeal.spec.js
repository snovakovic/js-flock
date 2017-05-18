const expect = require('chai').expect;
const deepSeal = require('../src/deepSeal');


describe('deepSeal', () => {
  it('Should deep seal nested objects', () => {
    const obj = deepSeal({
      first: {
        second: {
          third: {
            num: 11,
            fun() {}
          }
        }
      }
    });

    expect(Object.isSealed(obj.first.second)).to.equal(true);
    expect(Object.isSealed(obj.first.second.third)).to.equal(true);
    expect(Object.isSealed(obj.first.second.third.fun)).to.equal(true);
  });

  it('Circular reference should be handled', () => {
    const ob1 = { first: { test: 1 } };
    const ob2 = { second: { test: 2 } };

    // Create circular reference
    ob2.ob1 = ob1;
    ob1.ob2 = ob2;

    deepSeal(ob1);

    expect(Object.isSealed(ob1.first)).to.equal(true);
    expect(Object.isSealed(ob1.ob2)).to.equal(true);
    expect(Object.isSealed(ob1.ob2.second)).to.equal(true);
  });
});
