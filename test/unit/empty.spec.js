const { expect } = require('chai');

const empty = require('../../src/empty');


describe('empty', () => {
  it('Shuld empty flat array', () => {
    const flatArray = [1, 5, 3, 2, 4, 5];
    empty(flatArray);
    expect(flatArray.length).to.equal(0);
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
    expect(persons.length).to.equal(0);
    expect(response).to.eql(persons);
  });

  it('emptying already empty array should be ignored', () => {
    const emptyArr = [];
    const response = empty(emptyArr);
    expect(emptyArr).to.equal(response);
  });

  it('Should not break if array is not provided', () => {
    const response = empty(33);
    expect(response).to.eql(33);
  });
});
