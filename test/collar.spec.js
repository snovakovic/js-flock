const expect = require('chai').expect;
const collar = require('../src/collar');


const shouldNotBeCalled = () => { throw Error('This should not be called'); };


describe('collar', () => {
  it('One promise should be resolved', (done) => {
    collar(Promise.resolve('test'), 5)
      .then((response) => {
        expect(response).to.equal('test');
        done();
      }).catch(shouldNotBeCalled);
  });

  it('Multiple promise should be resolved', (done) => {
    collar(Promise.all([
      new Promise((resolve) => setTimeout(resolve, 1, '1')),
      new Promise((resolve) => setTimeout(resolve, 3, '2'))
    ]), 5)
      .then(([first, second]) => {
        expect(first).to.equal('1');
        expect(second).to.equal('2');
        done();
      }).catch(shouldNotBeCalled);
  });

  it('collar without time parameter should be resolved', (done) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1, '1'));
    collar(promise)
      .then((first) => {
        expect(first).to.equal('1');
        done();
      }).catch(shouldNotBeCalled);
  });

  it('Promise should be rejected because of long waiting', (done) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 10, '1'));
    collar(promise, 5)
      .then(shouldNotBeCalled)
      .catch((err) => {
        expect(err).to.equal('Promises have timed out');
        done();
      });
  });
});
