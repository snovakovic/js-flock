const expect = require('chai').expect;
const promisify = require('../src/promisify');


const shouldNotBeCalled = () => { throw Error('This should not be called'); };


describe('promisify', () => {
  let mdl;

  beforeEach(() => {
    mdl = {
      name: 'test-module',
      getName(cb) { cb(undefined, this.name); },
      success(inp, cb) { cb(undefined, `${inp}-success`); },
      error(cb) { cb('error'); }
    };
  });

  it('Should resolve promisified function', (done) => {
    const successFunAsync = promisify((cb) => cb(undefined, 'response'));

    successFunAsync().then((response) => {
      expect(response).to.equal('response');
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should reject promisified function', (done) => {
    const errorFunAsync = promisify((cb) => cb('error'));

    errorFunAsync()
      .then(shouldNotBeCalled)
      .catch((err) => {
        expect(err).to.equal('error');
        done();
      });
  });

  it('Should promisify function with multiple inputs', (done) => {
    const successFunAsync = promisify((p1, p2, cb) => {
      setTimeout(() => cb(undefined, [`${p1}-res`, `${p2}-res`]), 50);
    });

    successFunAsync('p1', 'p2').then(([response1, response2]) => {
      expect(response1).to.equal('p1-res');
      expect(response2).to.equal('p2-res');
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should handle multiple params with multiArgs option', (done) => {
    const fun = (cb) => cb(undefined, 'res1', 2, 'res3');
    const funAsync = promisify(fun, { multiArgs: true });

    funAsync().then(([r1, r2, r3]) => {
      expect(r1).to.equal('res1');
      expect(r2).to.equal(2);
      expect(r3).to.equal('res3');
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should return single param if multiArgs is not provided', (done) => {
    const funAsync = promisify((cb) => cb(undefined, 'res1', 2));

    funAsync().then((r1, r2) => {
      expect(r1).to.equal('res1');
      expect(r2).to.equal(undefined);
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should handle function with no params', (done) => {
    const funAsync = promisify((cb) => cb(undefined));

    funAsync().then((response) => {
      expect(response).to.equal(undefined);
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should handle function with no params and multiArgs option', (done) => {
    const fun = (cb) => cb(undefined);
    const funAsync = promisify(fun, { multiArgs: true });
    funAsync().then(([res1, res2]) => {
      expect(res1).to.equal(undefined);
      expect(res2).to.equal(undefined);
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should handle function that throws error', (done) => {
    const errorFunAsync = promisify(() => { throw Error('Error have happened in function'); });
    errorFunAsync()
      .then(shouldNotBeCalled)
      .catch((err) => {
        expect(err).to.be.an('error');
        done();
      });
  });

  it('Should promisify all', (done) => {
    const asyncModule = promisify.all(mdl);
    const prom1 = asyncModule.successAsync('test').then((response) => {
      expect(response).to.equal('test-success');
    }).catch(shouldNotBeCalled);
    const prom2 = asyncModule.errorAsync().then(shouldNotBeCalled)
      .catch((err) => {
        expect(err).to.equal('error');
      });

    expect('nameAsync' in asyncModule).to.equal(false);
    expect('getNameAsync' in asyncModule).to.equal(true);
    Promise.all([prom1, prom2]).then(() => done());
  });

  it('Should promisify all preserving this', (done) => {
    const asyncModule = promisify.all(mdl);
    asyncModule.getNameAsync()
      .then((name) => {
        expect(name).to.be.equal(mdl.name);
        done();
      })
      .catch(shouldNotBeCalled);
  });

  it('Should promisify all and not mutate the module', () => {
    const allKeys = Object.keys(mdl);
    const asyncKeys = ['getNameAsync', 'successAsync', 'errorAsync'];
    const asyncModule = promisify.all(mdl);
    allKeys.push(...asyncKeys);

    expect(mdl).to.not.have.any.keys(asyncKeys);
    expect(asyncModule).to.have.all.keys(allKeys);
  });

  it('Should promisify all and mutate the module ', () => {
    const allKeys = Object.keys(mdl);
    const asyncModule = promisify.all(mdl, { mutate: true });
    allKeys.push('getNameAsync', 'successAsync', 'errorAsync');

    expect(asyncModule).to.deep.equal(mdl);
    expect(mdl).to.have.all.keys(allKeys);
  });

  it('Should promise all except excluded functions', () => {
    const asyncModule = promisify.all(mdl, { exclude: ['error', 'getName'] });
    expect('successAsync' in asyncModule).to.equal(true);
    expect('errorAsync' in asyncModule).to.equal(false);
    expect('getNameAsync' in asyncModule).to.equal(false);
  });

  it('Should promise only included functions', () => {
    const asyncModule = promisify.all(mdl, { include: ['error', 'getName'] });
    expect('successAsync' in asyncModule).to.equal(false);
    expect('errorAsync' in asyncModule).to.equal(true);
    expect('getNameAsync' in asyncModule).to.equal(true);
  });

  it('Should ignore if provided modules is not object', () => {
    const asyncModule = promisify.all('test');
    expect(asyncModule).to.equal('test');
  });
});
