const expect = require('chai').expect;
const promisify = require('../src/promisify');


const shouldNotBeCalled = () => { throw Error('This should not be called'); };


describe('promisify', () => {
  it('Should resolve promisified function', (done) => {
    const successFun = (cb) => cb(undefined, 'response');
    const successFunAsync = promisify(successFun);

    successFunAsync().then((response) => {
      expect(response).to.equal('response');
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should reject promisified function', (done) => {
    const errorFun = (cb) => cb('error');
    const errorFunAsync = promisify(errorFun);

    errorFunAsync()
    .then(shouldNotBeCalled)
    .catch((err) => {
      expect(err).to.equal('error');
      done();
    });
  });

  it('Should promisify function with multiple inputs', (done) => {
    const successFun = function(param1, param2, cb) {
      setTimeout(() => cb(undefined, [`${param1}-response`, `${param2}-response`]), 50);
    };
    const successFunAsync = promisify(successFun);

    successFunAsync('param1', 'param2').then(([response1, response2]) => {
      expect(response1).to.equal('param1-response');
      expect(response2).to.equal('param2-response');
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should resolve promisified function with multiple params with multiArgs', (done) => {
    const fun = (cb) => cb(undefined, 'res1', 2, 'res3');
    const funAsync = promisify(fun, { multiArgs: true });

    funAsync().then(([r1, r2, r3]) => {
      expect(r1).to.equal('res1');
      expect(r2).to.equal(2);
      expect(r3).to.equal('res3');
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should resolve promisified function with multiple params without multiArgs', (done) => {
    const fun = (cb) => cb(undefined, 'res1', 2);
    const funAsync = promisify(fun);

    funAsync().then((r1, r2) => {
      expect(r1).to.equal('res1');
      expect(r2).to.equal(undefined);
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should resolve promisified function with no params', (done) => {
    const fun = (cb) => cb(undefined);
    const funAsync = promisify(fun);

    funAsync().then((response) => {
      expect(response).to.equal(undefined);
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should resolve promisified function with no params and multiArgs', (done) => {
    const fun = (cb) => cb(undefined);
    const funAsync = promisify(fun, { multiArgs: true });

    funAsync().then(([res1, res2]) => {
      expect(res1).to.equal(undefined);
      expect(res2).to.equal(undefined);
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should handle function that throws error', (done) => {
    const badFun = () => { throw Error('Error have happened in function'); };
    const badFunAsync = promisify(badFun);

    badFunAsync()
      .then(shouldNotBeCalled)
      .catch((err) => {
        expect(err).to.be.an('error');
        done();
      });
  });
});
