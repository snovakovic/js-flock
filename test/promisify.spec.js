// Load modules

const expect = require('chai').expect;

const promisify = require('../src/promisify');

// Describe test cases

describe('promisify', () => {
  it('Should promisify error function without params', (done) => {
    const errorFun = function(cb) {
      cb('error');
    };
    const errorFunAsync = promisify(errorFun);
    errorFunAsync().then(() => {
      throw Error('This should not be called');
    }).catch((err) => {
      expect(err).to.equal('error');
      done();
    });
  });

  it('Should promisify success function without params', (done) => {
    const successFun = function(cb) {
      cb(undefined, 'response');
    };
    const successFunAsync = promisify(successFun);
    successFunAsync().then((response) => {
      expect(response).to.equal('response');
      done();
    }).catch(() => {
      throw Error('This should not be called');
    });
  });

  it('Should promisify function with multiple inputs', (done) => {
    const successFun = function(param1, param2, cb) {
      setTimeout(() => {
        cb(undefined, [`${param1}-response`, `${param2}-response`]);
      }, 50);
    };
    const successFunAsync = promisify(successFun);
    successFunAsync('param1', 'param2').then(([response1, response2]) => {
      expect(response1).to.equal('param1-response');
      expect(response2).to.equal('param2-response');
      done();
    }).catch(() => {
      throw Error('This should not be called');
    });
  });
});
