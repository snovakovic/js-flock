const { assert } = require('chai');
const delay = require('../../src/delay');

describe('delay', () => {
  it('Should delay execution', async() => {
    let numberOfCalls = 0;

    setTimeout(() => numberOfCalls++, 1); // should executeo
    setTimeout(() => numberOfCalls++, 5); // should executeo
    setTimeout(() => numberOfCalls++, 15); // should not executeo

    await delay(10);

    assert.equal(numberOfCalls, 2);
  });

  it('Should throw error if number is not passed', async() => {
    assert.throws(
      () => delay('long'),
      TypeError,
      'delay: expected [Number] but got [object String]'
    );
  });

  it('Should convert string to number', async() => {
    let numberOfCalls = 0;

    setTimeout(() => numberOfCalls++, 1); // should executeo
    setTimeout(() => numberOfCalls++, 5); // should executeo
    setTimeout(() => numberOfCalls++, 15); // should not executeo

    await delay('10');

    assert.equal(numberOfCalls, 2);
  });

  it('Should default to 0ms if nothing passed', async() => {
    let numberOfCalls = 0;

    setImmediate(() => numberOfCalls++); // should executeo
    setTimeout(() => numberOfCalls++, 5); // should not executeo

    await delay();

    assert.equal(numberOfCalls, 1);
  });
});
