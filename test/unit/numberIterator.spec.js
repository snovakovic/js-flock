const { assert } = require('chai');
const NumberIterator = require('../../src/NumberIterator');

describe('NumberIterator', () => {
  it('Will start iteration from 0', () => {
    const numberIterator = new NumberIterator();

    assert.equal(numberIterator.current(), 0);
    assert.equal(numberIterator.next(), 1);
    assert.equal(numberIterator.current(), 1);

    assert.equal(numberIterator.next(), 2);
    assert.equal(numberIterator.next(), 3);
    assert.equal(numberIterator.next(), 4);
  });

  it('will start iteration from 10', () => {
    const numberIterator = new NumberIterator({
      startFrom: 10
    });

    assert.equal(numberIterator.current(), 10);
    assert.equal(numberIterator.next(), 11);
    assert.equal(numberIterator.current(), 11);
  });

  it('will throw iterator exausted error', () => {
    const numberIterator = new NumberIterator({
      startFrom: Number.MAX_SAFE_INTEGER - 1
    });

    assert.equal(numberIterator.next(), Number.MAX_SAFE_INTEGER);

    assert.throws(() => numberIterator.next(), Error, 'Number iterator exausted');

    assert.equal(numberIterator.current(), Number.MAX_SAFE_INTEGER);
  });
});
