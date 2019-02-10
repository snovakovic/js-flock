const { expect, assert } = require('chai');
const sort = require('../../src/sort');

describe('sort', () => {
  let flatArray;
  let persons;
  let multiPropArray;

  function assertOrder(order, valueCb) {
    order.forEach((item, idx) => {
      assert.equal(valueCb(idx), item);
    });
  }

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
      lastName: null,
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
    assert.deepEqual(sorted, [1, 2, 3, 4, 5, 5]);
    assert.equal(sorted, flatArray);
  });

  it('Should sort flat array in descending order', () => {
    assert.deepEqual(sort(flatArray).desc(), [5, 5, 4, 3, 2, 1]);
  });

  it('Should sort by object property in ascending order', () => {
    sort(persons).asc(p => p.name.toLowerCase());
    assertOrder(['FIRST', 'In the middle', 'last'], idx => persons[idx].name);
  });

  it('Should sort by object property in descending order', () => {
    sort(persons).desc((p) => p.name.toLowerCase());
    assertOrder(['last', 'In the middle', 'FIRST'], idx => persons[idx].name);
  });

  it('Should sort undefined values to the bottom', () => {
    sort(persons).asc((p) => p.address.code);
    assertOrder([1, 3, undefined], idx => persons[idx].address.code);

    sort(persons).desc((p) => p.address.code);
    assertOrder([3, 1, undefined], idx => persons[idx].address.code);

    const sorted = sort([1, undefined, 3, null, 2]).desc();
    assert.deepEqual(sorted, [3, 2, 1, null, undefined]);
  });

  it('Should ignore values that are not sortable', () => {
    assert.equal(sort('string').asc(), 'string');
    assert.equal(sort(undefined).desc(), undefined);
    assert.equal(sort(null).desc(), null);
    assert.equal(sort(33).asc(), 33);
    assert.deepEqual(sort({ name: 'test' }).desc(), { name: 'test' });
    assert.equal(sort(33).by(), 33);
  });

  it('Should sort dates correctly', () => {
    sort(persons).asc('dob');
    assertOrder(['FIRST', 'In the middle', 'last'], idx => persons[idx].name);
  });

  it('Should should unwrap single array value', () => {
    sort(persons).asc(['name']);
    assertOrder(['FIRST', 'In the middle', 'last'], idx => persons[idx].name);
  });

  it('Should sort on multiple properties', () => {
    sort(multiPropArray).asc([
      p => p.name,
      p => p.lastName,
      p => p.age
    ]);

    assertOrder([10, 11, 8, 9, 6], idx => multiPropArray[idx].age);
  });

  it('Should sort on multiple properties by string sorter', () => {
    sort(multiPropArray).asc(['name', 'age', 'lastName']);
    assertOrder([8, 9, 10, 11, 6], idx => multiPropArray[idx].age);
  });

  it('Should sort on multiple mixed properties', () => {
    sort(multiPropArray).asc(['name', p => p.lastName, 'age']);
    assertOrder([10, 11, 8, 9, 6], idx => multiPropArray[idx].age);
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
    assert.equal(same[0].name, 'a');
  });

  it('Should sort by desc name and asc lastName', () => {
    sort(multiPropArray).by([
      { desc: 'name' },
      { asc: 'lastName' }
    ]);

    assertOrder(['aa', 'aa', 'bb', undefined, null], idx => multiPropArray[idx].lastName);
  });

  it('Should sort by asc name and desc age', () => {
    sort(multiPropArray).by([
      { asc: 'name' },
      { desc: 'age' }
    ]);

    assertOrder([11, 10, 9, 8, 6], idx => multiPropArray[idx].age);
  });


  it('Should sort by asc lastName, desc name and asc age', () => {
    sort(multiPropArray).by([
      { asc: p => p.lastName },
      { desc: p => p.name },
      { asc: p => p.age }
    ]);

    assertOrder([6, 10, 11, 8, 9], idx => multiPropArray[idx].age);
  });

  it('Should throw invalid usage of by sorter exception', () => {
    expect(() => sort(multiPropArray).by('name'))
      .to.throw(Error);

    expect(() => sort(multiPropArray).by([{ asci: 'name' }]))
      .to.throw(Error);

    expect(() => sort(multiPropArray).by([{ asc: 'lastName' }, { ass: 'name' }]))
      .to.throw(Error);
  });

  it('Should sort ascending with by on 1 property', () => {
    sort(multiPropArray).by([
      { asc: p => p.age }
    ]);

    assertOrder(
      [6, 8, 9, 10, 11],
      idx => multiPropArray[idx].age
    );
  });

  it('Should sort descending with by on 1 property', () => {
    sort(multiPropArray).by([
      { desc: p => p.age }
    ]);

    assertOrder(
      [11, 10, 9, 8, 6],
      idx => multiPropArray[idx].age,
    );
  });
});
