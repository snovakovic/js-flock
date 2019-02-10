const { assert } = require('chai');
const { delay } = require('../utils');
const singular = require('../../src/singular');

describe('singular', () => {
  it('Should ignore calls to the function when in progress', async() => {
    let noCalls = 0;
    const test = singular((finished) => {
      noCalls += 1;
      setImmediate(finished);
    });

    test();
    test();
    test();

    assert.equal(noCalls, 1);

    await delay(5);

    test();
    test();

    assert.equal(noCalls, 2);
  });

  it('Should resolve function with arguments', async() => {
    let total = 0;
    const test = singular((finished, increaseBy) => {
      total += increaseBy;
      setImmediate(finished);
    });

    test(5);
    test(3);
    test(2);

    assert.equal(total, 5);

    await delay(5);

    test(10);
    test(12);
    assert.equal(total, 15);
  });

  it('Should preserve this', () => {
    const obj = { test: 'test' };
    const test = singular(function() {
      assert.equal(this, obj);
    });
    test.apply(obj);
  });
});
