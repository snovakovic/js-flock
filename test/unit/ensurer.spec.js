const { assert } = require('chai');
const Ensurer = require('../../src/Ensurer');

describe('Ensurer', () => {
  it('Will throw default error if called more then once', () => {
    const ensure = new Ensurer();
    ensure.calledMaxOnce();
    const expectedErrorMessage = 'Not allowed to be called more then once';
    assert.throws(() => ensure.calledMaxOnce(), Error, expectedErrorMessage);
  });

  it('will throw custom error if called more then once', () => {
    const ensure = new Ensurer();
    const messageInCaseOfError1 = 'Called first time should not throw error';
    ensure.calledMaxOnce(messageInCaseOfError1);

    const messageInCaseOfError2 = 'Called second time it should throw error';
    assert.throws(() => ensure.calledMaxOnce(messageInCaseOfError2), Error, messageInCaseOfError2);
  });
});
