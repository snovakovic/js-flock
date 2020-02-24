const { assert } = require('chai');
const single = require('../../src/single');

describe.only('single', () => {
  let users;

  beforeEach(() => {
    users = [
      { email: 'john@doe.com', fullName: 'John Doe 1' },
      { email: 'john@doe.com', fullName: 'John Doe 2' }, // NOTE same email as John Doe 1
      { email: 'mark@johnson.com', fullName: 'Mark Johnson' }
    ];
  });

  it('Should return single value', () => {
    const testUser = { email: 'john@doe.com', fullName: 'John Doe 1' };

    assert.equal(single([1]), 1);
    assert.equal(single([testUser]), testUser);

    const mark = single(users, user => user.email === 'mark@johnson.com');
    assert.deepEqual(mark, { email: 'mark@johnson.com', fullName: 'Mark Johnson' });
  });

  it('Should throw error if more than 1 value matches condition', () => {
    const errorMessage = 'More than one element satisfies the condition';
    assert.throws(() => single([1, 2]), TypeError, errorMessage);
    assert.throws(() => single(users), TypeError, errorMessage);
    assert.throws(() => single(users, user => user.email === 'john@doe.com'), TypeError, errorMessage);
  });

  it('Should throw error if none of the values matches condition', () => {
    const errorMessage = 'No element satisfies the condition';
    assert.throws(() => single([]), TypeError, errorMessage);
    assert.throws(() => single(users, user => user.email === 'no@user.com'), TypeError, errorMessage);
  });
});
