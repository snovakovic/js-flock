const { expect } = require('chai');

const sort = require('../../src/sort');


describe('sort', () => {
  let flatArray;
  let persons;
  let multiPropArray;

  beforeEach(() => {
    flatArray = [1, 5, 3, 2, 4, 5];

    persons = [{
      name: 'last',
      dob: new Date(1987, 14, 11),
      address: { code: 3 }
    }, {
      name: 'FIRST',
      dob: new Date(1987, 14, 9),
      address: {}
    }, {
      name: 'In the middle',
      dob: new Date(1987, 14, 10),
      address: { code: 1 }
    }];

    multiPropArray = [{
      name: 'aa',
      lastName: 'aa',
      age: 10
    }, {
      name: 'aa',
      lastName: undefined,
      age: 8
    }, {
      name: 'aa',
      lastName: undefined,
      age: 9
    }, {
      name: 'aa',
      lastName: 'bb',
      age: 11
    }, {
      name: 'bb',
      lastName: 'aa',
      age: 6
    }];
  });

  it('Should sort flat array in ascending order', () => {
    const sorted = sort(flatArray).asc();
    expect(sorted).to.eql([1, 2, 3, 4, 5, 5]);
    expect(sorted).to.equal(flatArray);
  });

  it('Should sort flat array in descending order', () => {
    expect(sort(flatArray).desc()).to.eql([5, 5, 4, 3, 2, 1]);
  });

  it('Should sort by object property in ascending order', () => {
    sort(persons).asc((p) => p.name.toLowerCase());
    expect(persons[0].name).to.equal('FIRST');
    expect(persons[1].name).to.equal('In the middle');
    expect(persons[2].name).to.equal('last');
  });

  it('Should sort by object property in ascending order', () => {
    sort(persons).desc((p) => p.name.toLowerCase());
    expect(persons[2].name).to.equal('FIRST');
    expect(persons[1].name).to.equal('In the middle');
    expect(persons[0].name).to.equal('last');
  });

  it('Should sort undefined values to the bottom', () => {
    sort(persons).asc((p) => p.address.code);
    expect(persons[0].address.code).to.equal(1);
    expect(persons[1].address.code).to.equal(3);
    expect(persons[2].address.code).to.equal(undefined);

    sort(persons).desc((p) => p.address.code);
    expect(persons[0].address.code).to.equal(3);
    expect(persons[1].address.code).to.equal(1);
    expect(persons[2].address.code).to.equal(undefined);

    const sorted = sort([1, undefined, 3, null, 2]).desc();
    expect(sorted).to.eql([3, 2, 1, null, undefined]);
  });

  it('Should ignore values that are not sortable', () => {
    expect(sort('string').asc()).to.equal('string');
    expect(sort(undefined).desc()).to.equal(undefined);
    expect(sort(null).desc()).to.equal(null);
    expect(sort(33).asc()).to.equal(33);
    expect(sort({ name: 'test' }).desc()).to.eql({ name: 'test' });
  });

  it('Should sort dates correctly', () => {
    sort(persons).asc('dob');
    expect(persons[0].name).to.equal('FIRST');
    expect(persons[1].name).to.equal('In the middle');
    expect(persons[2].name).to.equal('last');
  });

  it('Should sort on multiple properties', () => {
    sort(multiPropArray).asc([
      (p) => p.name,
      (p) => p.lastName,
      (p) => p.age
    ]);

    expect(multiPropArray[0].age).to.equal(10);
    expect(multiPropArray[1].age).to.equal(11);
    expect(multiPropArray[2].age).to.equal(8);
    expect(multiPropArray[3].age).to.equal(9);
    expect(multiPropArray[4].age).to.equal(6);
  });

  it('Should sort on multiple properties by string sorter', () => {
    sort(multiPropArray).asc(['name', 'age', 'lastName']);
    expect(multiPropArray[0].age).to.equal(8);
    expect(multiPropArray[1].age).to.equal(9);
    expect(multiPropArray[2].age).to.equal(10);
    expect(multiPropArray[3].age).to.equal(11);
    expect(multiPropArray[4].age).to.equal(6);
  });

  it('Should sort on multiple mixed properties', () => {
    sort(multiPropArray).asc(['name', (p) => p.lastName, 'age']);
    expect(multiPropArray[0].age).to.equal(10);
    expect(multiPropArray[1].age).to.equal(11);
    expect(multiPropArray[2].age).to.equal(8);
    expect(multiPropArray[3].age).to.equal(9);
    expect(multiPropArray[4].age).to.equal(6);
  });

  it('Should should unwrap single array value', () => {
    sort(persons).asc(['name']);
    expect(persons[0].name).to.equal('FIRST');
    expect(persons[1].name).to.equal('In the middle');
    expect(persons[2].name).to.equal('last');
  });

  it('Should sort with all equal values', () => {
    const same = [{
      name: 'a',
      age: 1
    }, {
      name: 'a',
      age: 1
    }];

    sort(same).asc(['name', 'age']);
    expect(same[0].name).to.equal('a');
  });
});
