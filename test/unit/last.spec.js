const { assert } = require('chai');
const last = require('../../src/last');

describe('last', () => {
  let flatArray;
  let persons;

  beforeEach(() => {
    flatArray = [1, 5, 3, 2, 4, 5];
    persons = [
      { id: 1, name: 'first' },
      { id: 2, name: 'middle' },
      { id: 3, name: 'middle' },
      { id: 4, name: 'last' }
    ];
  });

  it('Should return last element of array', () => {
    assert.equal(last(flatArray), 5);
    assert.equal(last(persons).name, 'last');
  });

  it('Should return last element of array that meets condition', () => {
    const person = last(persons, p => p.name === 'middle');
    assert.equal(person.id, 3);
  });

  it('Should return undefined for condition that does not match any element', () => {
    const person = last(persons, p => p.name === 'empty');
    assert.equal(person, undefined);
  });

  it('Should return undefined if array is not provided', () => {
    assert.equal(last(null), undefined);
    assert.equal(last({}), undefined);
    assert.equal(last(33), undefined);
    assert.equal(last(true), undefined);
    assert.equal(last('string'), undefined);
  });

  it('Should return last element if condition is not function', () => {
    assert.equal(last(persons, {}).id, 4);
    assert.equal(last(persons, null).id, 4);
  });
});
