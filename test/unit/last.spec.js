const { expect } = require('chai');

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
    expect(last(flatArray)).to.equal(5);
    expect(last(persons).name).to.equal('last');
  });

  it('Should return last element of array that meets condition', () => {
    const person = last(persons, (p) => p.name === 'middle');
    expect(person.id).to.equal(3);
  });

  it('Should return undefined for condition that does not match any element', () => {
    const person = last(persons, (p) => p.name === 'empty');
    expect(person).to.equal(undefined);
  });

  it('Should return undefined if array is not provided', () => {
    expect(last(null)).to.equal(undefined);
    expect(last({})).to.equal(undefined);
    expect(last(33), (p) => p.name === 'middle').to.equal(undefined);
    expect(last(true), (p) => p.name === 'middle').to.equal(undefined);
    expect(last('string'), (p) => p.name === 'middle').to.equal(undefined);
  });

  it('Should return last element if condition is not function', () => {
    expect(last(persons, {}).id).to.equal(4);
    expect(last(persons, null).id).to.equal(4);
  });
});
