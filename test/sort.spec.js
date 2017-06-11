const expect = require('chai').expect;
const sort = require('../src/sort');


describe('sort', () => {
  it.only('Should sort flat array', () => {
    const arr = [1, 5, 3, 2, 4];
    const sorted = sort(arr).asc();
    console.log(arr);
    console.log(sorted);
    expect(sorted).to.eql([1, 2, 3, 4, 5]);
  });
});
