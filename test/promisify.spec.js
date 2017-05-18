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
