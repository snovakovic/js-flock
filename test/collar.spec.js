const expect = require('chai').expect;
const collar = require('../src/collar');


const shouldNotBeCalled = () => { throw Error('This should not be called'); };


describe('collar', () => {
  it('Should resolve single promise', (done) => {
    collar(Promise.resolve('test'), 5)
      .then((response) => {
        expect(response).to.equal('test');
        done();
      }).catch(shouldNotBeCalled);
  });

  it('Should resolve multiple promises', (done) => {
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

  it('Should resolve collar without timeout provided', (done) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1, '1'));
    collar(promise)
      .then((first) => {
        expect(first).to.equal('1');
        done();
      }).catch(shouldNotBeCalled);
  });

  it('Should strangled promise', (done) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 10, '1'));
    collar(promise, 5)
      .then(shouldNotBeCalled)
      .catch((err) => {
        expect(err.isStrangled).to.equal(true);
        expect(err.message).to.equal('Promise have timed out');
        done();
      });
  });
});
