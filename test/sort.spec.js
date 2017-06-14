const expect = require('chai').expect;
const sort = require('../src/sort');


describe('sort', () => {
  let flatArray;
  let persons;

  beforeEach(() => {
    flatArray = [1, 5, 3, 2, 4, 5];
    persons = [{
      name: 'last',
      dob: new Date(1987, 14, 11),
      address: {
        code: 3
      }
    }, {
      name: 'FIRST',
      dob: new Date(1987, 14, 9),
      address: {}
    }, {
      name: 'In the middle',
      dob: new Date(1987, 14, 10),
      address: {
        code: 1
      }
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

  it('Should handle asc object sort by lowercasing string', () => {
    sort(persons).asc((p) => p.name.toLowerCase());
    expect(persons[0].name).to.equal('FIRST');
    expect(persons[1].name).to.equal('In the middle');
    expect(persons[2].name).to.equal('last');
  });

  it('Should handle desc object sort by lowercasing string', () => {
    sort(persons).desc((p) => p.name.toLowerCase());
    expect(persons[2].name).to.equal('FIRST');
    expect(persons[1].name).to.equal('In the middle');
    expect(persons[0].name).to.equal('last');
  });

  it('Undefined values should always be at the bottom', () => {
    sort(persons).asc((p) => p.address.code);
    expect(persons[0].address.code).to.equal(1);
    expect(persons[1].address.code).to.equal(3);
    expect(persons[2].address.code).to.equal(undefined);

    sort(persons).desc((p) => p.address.code);
    expect(persons[0].address.code).to.equal(3);
    expect(persons[1].address.code).to.equal(1);
    expect(persons[2].address.code).to.equal(undefined);
  });

  it('Unsortable values should not throw error', () => {
    expect(sort('string').asc()).to.equal('string');
    expect(sort(undefined).desc()).to.equal(undefined);
    expect(sort(null).desc()).to.equal(null);
    expect(sort(33).asc()).to.equal(33);
    expect(sort({ name: 'test' }).desc()).to.eql({ name: 'test' });
  });

  it('should sort dates correctly', () => {
    sort(persons).asc((p) => p.dob);
    expect(persons[0].name).to.equal('FIRST');
    expect(persons[1].name).to.equal('In the middle');
    expect(persons[2].name).to.equal('last');
  });
});
