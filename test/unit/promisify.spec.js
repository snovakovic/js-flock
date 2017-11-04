const { expect } = require('chai');

const promisify = require('../../src/promisify');


const shouldNotBeCalled = () => {
  throw Error('This should not be called');
};


describe('promisify', () => {
  let fun;

  beforeEach(() => {
    fun = (cb) => cb(undefined);
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
    const testFun = (cb) => cb(undefined, 'res1', 2, 'res3');
    const funAsync = promisify(testFun, { multiArgs: true });

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
    promisify(fun)().then((response) => {
      expect(response).to.equal(undefined);
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should handle function with no params and multiArgs option', (done) => {
    const funAsync = promisify(fun, { multiArgs: true });

    funAsync().then(([res1, res2]) => {
      expect(res1).to.equal(undefined);
      expect(res2).to.equal(undefined);
      done();
    }).catch(shouldNotBeCalled);
  });

  it('Should handle function that throws error', (done) => {
    const errorFunAsync = promisify(() => { throw Error(); });
    errorFunAsync()
      .then(shouldNotBeCalled)
      .catch((err) => {
        expect(err).to.be.an('error');
        done();
      });
  });

  it('Should work with truthy values for multyArgs', (done) => {
    const funAsync1 = promisify(fun, { multiArgs: 33 });
    const funAsync2 = promisify(fun, { multiArgs: null });
    Promise.all([
      funAsync1()
        .then((args) => { expect(args).to.be.an('array'); })
        .catch(shouldNotBeCalled),
      funAsync2()
        .then((args) => { expect(args).to.not.be.an('array'); })
        .catch(shouldNotBeCalled)
    ]).then(() => done());
  });

  it('Should throw type error if function not provided', () => {
    const error = 'promisify: expected [Function] but got';
    expect(() => promisify(new Map())).to.throw(TypeError, `${error} [object Map]`);
    expect(() => promisify(undefined)).to.throw(TypeError, `${error} [object Undefined]`);
  });

  it('Should not break on invalid options', () => {
    expect(promisify(fun, undefined)()).to.be.a('promise');
    expect(promisify(fun, [])()).to.be.a('promise');
    expect(promisify(fun, null)()).to.be.a('promise');
    expect(promisify(fun, 33)()).to.be.a('promise');
  });
});


describe('promisify.all', () => {
  let mdl;
  let proto;

  beforeEach(() => {
    mdl = {
      name: 'test-module',
      getName(cb) { cb(undefined, this.name); },
      success(inp, cb) { cb(undefined, `${inp}-success`); },
      error(cb) { cb('error'); }
    };

    const ob1 = Object.create(mdl);
    ob1.ob1 = () => {};
    proto = Object.create(ob1);
    proto.proto = () => {};
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

  it('Should promisify object without prototype', () => {
    const test = Object.create(null);
    test.fn1 = () => {};
    const async = promisify.all(test);
    expect(async).to.include.all.keys(['fn1', 'fn1Async']);
  });

  it('Should promisify all except excluded functions', () => {
    const asyncModule = promisify.all(mdl, { exclude: ['error', 'getName'] });
    expect('successAsync' in asyncModule).to.equal(true);
    expect(asyncModule).to.not.include.all.keys(['errorAsync', 'getNameAsync']);
  });

  it('Should promisify only included functions', () => {
    const asyncModule = promisify.all(mdl, { include: ['error', 'getName'] });
    expect('successAsync' in asyncModule).to.equal(false);
    expect(asyncModule).to.include.all.keys(['errorAsync', 'getNameAsync']);
  });

  it('Should promisify all and apply custom suffix', () => {
    const asyncModule = promisify.all(mdl, { suffix: 'Promisified' });
    const asyncKeys = ['getNamePromisified', 'successPromisified', 'errorPromisified'];
    expect(asyncModule).to.include.all.keys(asyncKeys);
  });

  it('Should not promisify prototype chain', () => {
    promisify.all(proto);
    expect(proto).to.include.all.keys(['protoAsync']);
    expect(proto).to.not.include.all.keys(['getNameAsync', 'ob1Async']);
  });

  it('Should promisify prototype chain', () => {
    promisify.all(proto, { proto: true });
    expect(proto.protoAsync).to.be.an('function');
    expect(proto.ob1Async).to.be.an('function');
    expect(proto.getNameAsync).to.be.an('function');
  });

  it('Should not override prototype', () => {
    promisify.all(proto, { proto: 33 }); // Should behave truthi
    expect(proto.hasOwnProperty('protoAsync')).to.equal(true);
  });

  it('Should skip already promisified functions', () => {
    promisify.all(mdl);
    promisify.all(mdl);
    expect(mdl).to.include.all.keys(['getNameAsync', 'successAsync']);
    expect(mdl).to.not.include.all.keys(['getNameAsyncAsync', 'successAsyncAsync']);
  });

  it('Should not override existing methods', (done) => {
    const test = {
      test: (cb) => { cb(undefined, 'test'); },
      testAsync: (cb) => { cb(undefined, 'testAsync'); }
    };

    promisify.all(test);
    const keys = ['test', 'testAsync', 'testAsyncAsync', 'testAsyncPromisified'];
    expect(test).to.include.all.keys(keys);
    expect(test.testAsync((err, val) => {
      expect(val).to.be.equal('testAsync');
      done();
    }));
  });

  it('Should use default suffix if invalid suffix is provided', () => {
    promisify.all(mdl, { suffix: 33 });
    expect('getNameAsync' in mdl).to.equal(true);
  });

  it('Should throw TypeError if plain object is not provided', () => {
    const error = 'promisify: expected [Object] but got';
    expect(() => promisify.all(33)).to.throw(TypeError, `${error} [object Number]`);
    expect(() => promisify.all(null)).to.throw(TypeError, `${error} [object Null]`);
    expect(() => promisify.all([])).to.throw(TypeError, `${error} [object Array]`);
  });

  it('Should not modify options object', () => {
    const baseOpt = { suffix: 1, exclude: 2, include: 3, proto: 4, multiArgs: 5 };
    const options = Object.assign({}, baseOpt);
    promisify.all(mdl, Object.assign({}, options));
    expect(options).to.be.eql(baseOpt);
  });

  it('should not break on invalid exclude/include', () => {
    const p1 = promisify.all({ test: () => {} }, { exclude: 33 });
    const p2 = promisify.all({ test: () => {} }, { exclude: [null, undefined, 33] });
    const p3 = promisify.all({ test: () => {} }, { include: [null, undefined, 33] });
    expect(p1).to.have.any.key('testAsync');
    expect(p2).to.have.any.key('testAsync');
    expect(p3).to.not.have.key('testAsync');
  });
});
