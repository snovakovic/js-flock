const { assert } = require('chai');

const promiseAll = require('../../src/promiseAll');

function resolveWith(value, after) {
  return new Promise((resolve) => {
    setTimeout(resolve, after, value);
  });
}

function rejectWith(value, after) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, after, value);
  });
}


describe('promiseAll', () => {
  it('Should resolve object of promises', async() => {
    const response = await promiseAll({
      foo: resolveWith('foo-prop', 1),
      bar: resolveWith('bar-prop', 10),
      baz: resolveWith('baz-prop', 2),
      boo: resolveWith('boo-prop', 5)
    });

    assert.deepEqual(response, {
      foo: 'foo-prop',
      bar: 'bar-prop',
      baz: 'baz-prop',
      boo: 'boo-prop'
    });
  });

  it('Should resolve object that is mix of promises and non promises', async() => {
    const response = await promiseAll({
      foo: resolveWith('foo-prop', 10),
      bar: resolveWith('bar-prop', 2),
      baz: 'baz-prop',
      boo: resolveWith('boo-prop', 5)
    });

    assert.deepEqual(response, {
      foo: 'foo-prop',
      bar: 'bar-prop',
      baz: 'baz-prop',
      boo: 'boo-prop'
    });
  });

  it('Should not resolve', async() => {
    let error;

    try {
      await promiseAll({
        foo: resolveWith('a', 1),
        bar: rejectWith('reject reason', 5)
      });
    } catch (err) {
      error = err;
    }

    assert.equal(error, 'reject reason');
  });

  it('Should resolve array or promises', async() => {
    const response = await promiseAll([
      resolveWith('foo-prop', 1),
      resolveWith('bar-prop', 3)
    ]);

    assert.deepEqual(response, [
      'foo-prop',
      'bar-prop'
    ]);
  });

  it('Should resolve array or promises and non promises', async() => {
    const response = await promiseAll([
      resolveWith('foo-prop', 1),
      'bar-prop',
    ]);

    assert.deepEqual(response, [
      'foo-prop',
      'bar-prop'
    ]);
  });
});
