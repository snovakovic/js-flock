const { assert } = require('chai');
const collar = require('../../src/collar');

describe('collar', () => {
  it('Should resolve single promise', async() => {
    const response = await collar(Promise.resolve('test'), 5);
    assert.equal(response, 'test');
  });

  it('Should resolve multiple promises', async() => {
    const promises = Promise.all([
      new Promise((resolve) => setTimeout(resolve, 1, '1')),
      new Promise((resolve) => setTimeout(resolve, 3, '2')),
    ]);

    const [first, second] = await collar(promises, 15);

    assert.equal(first, '1');
    assert.equal(second, '2');
  });

  it('Should resolve collar without timeout provided', async() => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1, '1'));
    const first = await collar(promise);
    assert.equal(first, '1');
  });

  it('Should strangled promise', (done) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 10, '1'));

    collar(promise, 5)
      .catch((err) => {
        assert.equal(err.isStrangled, true);
        assert.equal(err.message, 'Promise have timed out');
        done();
      });
  });
});
