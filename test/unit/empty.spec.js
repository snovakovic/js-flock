const { assert } = require('chai');
const empty = require('../../src/empty');

describe('empty', () => {
  it('Should empty flat array', () => {
    const flatArray = [1, 5, 3, 2, 4, 5];
    empty(flatArray);
    assert.equal(flatArray.length, 0);
  });

  it('Should empty deep object array', () => {
    const persons = [
      { id: 1, name: 'first' },
      {
        id: 2,
        name: 'middle',
        address: {
          city: 'Split'
        }
      },
      { id: 3, name: 'middle' },
      { id: 4, name: 'last' }
    ];

    // response should be equal to the provided emptied array
    const response = empty(persons);
    assert.equal(persons.length, 0);
    assert.deepEqual(response, persons);
  });

  it('Should empty multiple arrays', () => {
    const arr1 = [1];
    const arr2 = [1, 2];
    const arr3 = [1, 2, 3];

    const response = empty(arr1, arr2, arr3);

    assert.equal(response.length, 3);
    assert.equal(arr1.length, 0);
    assert.equal(arr2.length, 0);
    assert.equal(arr3.length, 0);

    assert.equal(response[2], arr3);
    assert.deepEqual(response[2], arr2);
  });

  it('emptying already empty array should be ignored', () => {
    const emptyArr = [];
    const response = empty(emptyArr);
    assert.equal(emptyArr, response);
  });

  it('Should not break if array is not provided', () => {
    const response = empty(33);
    assert.deepEqual(response, 33);
  });
});
