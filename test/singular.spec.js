const expect = require('chai').expect;
const one = require('../src/singular');


describe('singular', () => {
  it('Should behave correctly', (done) => {
    let noCalls = 0;
    const test = one((finished) => {
      noCalls += 1;
      setImmediate(finished);
    });

    test();
    test();
    test();

    expect(noCalls).to.equal(1);

    setTimeout(() => {
      test();
      test();
      expect(noCalls).to.equal(2);
      done();
    }, 1);
  });

  it('Should resolve function with arguments', (done) => {
    let total = 0;
    const test = one((increaseBy, finished) => {
      total += increaseBy;
      setImmediate(finished);
    });

    test(5);
    test(3);
    test(2);

    expect(total).to.equal(5);

    setTimeout(() => {
      test(10);
      test(12);
      expect(total).to.equal(15);
      done();
    }, 1);
  });
});
