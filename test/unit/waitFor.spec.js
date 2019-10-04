const { assert } = require('chai');
const { delay } = require('../utils');
const waitFor = require('../../src/waitFor');

describe('waitFor', () => {
  it('Should wait for value to become true', (done) => {
    let condition = false;

    waitFor(() => condition)
      .then(() => {
        assert.isTrue(condition);
        done();
      });

    setTimeout(() => condition = true, 5);
  });

  it('Should resolve for truthy values', (done) => {
    const ob = { test: 'test' };
    let condition;

    waitFor(() => condition)
      .then((resolvedValue) => {
        assert.equal(condition, ob);
        assert.equal(resolvedValue, ob);
        done();
      });

    setTimeout(() => condition = ob, 5);
  });

  it('Should resolve for custom comparison', (done) => {
    let condition;

    waitFor(() => condition === 55)
      .then((resolvedValue) => {
        assert.equal(condition, 55);
        assert.isTrue(resolvedValue);
        done();
      });

    setTimeout(() => condition = 55, 5);
  });

  it('Should resolve multiple waitFor', (done) => {
    let condition = false;
    const p1 = waitFor(() => condition, { interval: 1 })
      .then(() => assert.isTrue(condition));

    const p2 = waitFor(() => condition, { interval: 1 })
      .then(() => assert.isTrue(condition));

    const p3 = waitFor(() => condition === 55)
      .then(() => assert.equal(condition, 55));

    Promise
      .all([p1, p2, p3])
      .then(() => done());

    setTimeout(() => condition = true, 5);
    setTimeout(() => condition = 55, 10);
  });

  it('Should ignore invalid properties', (done) => {
    let condition = false;
    const cond = () => condition;
    const resolver = () => assert.isTrue(condition);

    Promise.all([
      waitFor(cond, null).then(resolver),
      waitFor(cond, new Map()).then(resolver),
      waitFor(cond, 'something').then(resolver),
      waitFor(cond, []).then(resolver),
      waitFor(cond, { timeout: '33', interval: '44' }).then(resolver),
      waitFor(cond, { timeout: 'aa', interval: 'bb' }).then(resolver)
    ])
      .then(() => done());

    setTimeout(() => condition = true, 5);
  });

  it('Should preserve this', (done) => {
    const test = { continue: false };
    const condition = (function() {
      return this.continue;
    }).bind(test);

    waitFor(condition)
      .then(() => {
        assert.isTrue(test.continue);
        done();
      });

    setTimeout(() => test.continue = true, 10);
  });

  it('Should throw error if function is not provided', () => {
    const error = 'waitFor: expected [Function] but got';

    assert.throws(() => waitFor(33), TypeError, `${error} [object Number]`);
    assert.throws(() => waitFor(null), TypeError, `${error} [object Null]`);
  });

  it('Should timed out with exception', (done) => {
    let condition = false;

    waitFor(() => condition, { timeout: 5, interval: 2 })
      .catch((err) => {
        assert.instanceOf(err, Error);
        assert.equal(err.message, 'Timed out!');
        done();
      });

    setTimeout(() => { condition = true; }, 10);
  });

  it('Should abort execution without throwing error', async() => {
    let numberOfCalls = 0;
    let thenIsCalled = false;
    let catchIsCalled = false;

    waitFor((abort) => {
      numberOfCalls += 1;
      abort();
      // Even thou true is returned we should not resolve it as abort was called before
      return true;
    }, { interval: 1 })
      .then(() => thenIsCalled = true)
      .catch(() => catchIsCalled = true);

    await delay(10);

    assert.equal(numberOfCalls, 1);
    assert.isFalse(thenIsCalled);
    assert.isFalse(catchIsCalled);
  });
});
