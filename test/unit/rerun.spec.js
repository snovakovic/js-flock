const { expect } = require('chai');

const rerun = require('../../src/rerun');


describe('rerun', () => {
  let counter;

  beforeEach(() => {
    counter = 0;
  });

  it('Should rerun function 5 times', (done) => {
    rerun(() => { counter += 1; })
      .every(0)
      .asLongAs((count) => count < 5)
      .start()
      .onStop(() => {
        expect(counter).to.equal(5);

        // ensure execution did not continue after this point
        setTimeout(() => {
          expect(counter).to.equal(5);
          done();
        }, 5);
      });
  });

  it('It should stop execution from withing function', (done) => {
    rerun(() => {
      counter += 1;
      if (counter === 5) {
        return false; // Stop execution
      }
      return true; // Not required by rerun
    })
      .every(0)
      .start();

    setTimeout(() => {
      expect(counter).to.equal(5);
      done();
    }, 10);
  });

  it('Should start/stop execution with', (done) => {
    const runner = rerun(() => { counter += 1; })
      .every(5)
      .start();

    setTimeout(() => {
      // at this point rerunn should be called 2 times
      // From initial call and after 5 ms of delay
      runner.stop();
    }, 7);

    setTimeout(() => {
      expect(counter).to.equal(2);

      runner.start();

      setTimeout(() => {
        runner.stop();
        expect(counter).to.equal(4);
        done();
      }, 7);

    }, 20);
  });

  it('Should throw error if start is called before calling every', () => {
    expect(() => rerun(() => {}).start())
      .to.throw(Error, 'rerun: every() is required before calling start()');
  });

  it('Should throw error on invalid inputs', () => {
    const invalidMessageForEvery = 'rerun: every() need to be called with positive number';
    const getErrorMessage = (expected, actual) =>
      `rerun: expected [${expected}] but got [object ${actual}]`;

    // Invalid onStop values
    expect(() => rerun(() => {}).onStop(33))
      .to.throw(Error, getErrorMessage('Function', 'Number'));

    // Invalid asLongAs value
    expect(() => rerun(() => {}).asLongAs([]))
      .to.throw(Error, getErrorMessage('Function', 'Array'));

    // Invalid every values
    expect(() => rerun(() => {}).every('a33'))
      .to.throw(Error, invalidMessageForEvery);

    // String number will be casted to number so this is valid call
    expect(() => rerun(() => {}).every('33'))
      .not.to.throw(Error, invalidMessageForEvery);
  });
});
