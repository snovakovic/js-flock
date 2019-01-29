const { expect } = require('chai');

const promiseAll = require('../../src/promiseAll');

function resolveWith(value, { after }) {
  return new Promise((resolve) => {
    setTimeout(resolve, after, value);
  });
}

describe('promiseAll', () => {
  it('Should resolve object of promises', async() => {
    const response = await promiseAll({
      foo: resolveWith('foo-prop', 1),
      bar: resolveWith('bar-prop', 5),
      baz: resolveWith('bar-prop', 2)
    });

    expect(response).to.deep.equal({
      foo: 'foo-prop',
      bar: 'bar-prop',
      baz: 'baz-prop'
    });
  });

  it('Should resolve array or promises', async() => {
    const response = await promiseAll([
      resolveWith('foo-prop', 1),
      resolveWith('bar-prop', 3)
    ]);

    expect(response).to.deep.equal([
      'foo-prop',
      'bar-prop'
    ]);
  });
});
