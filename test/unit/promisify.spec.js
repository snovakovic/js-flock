const { expect, shouldNotBeCalled } = require('chai');
const promisify = require('../../src/promisify');

describe('promisify', () => {
  let funct;

  beforeEach(() => {
    funct = cb => cb(undefined);
  });

  it('Should resolve promisified function', async() => {
    const successFunAsync = promisify(cb => cb(undefined, 'response'));
    const response = await successFunAsync();

    expect(response).to.equal('response');
  });

  it('Should reject promisified function', (done) => {
    const errorFunAsync = promisify(cb => cb('error'));

    errorFunAsync()
      .catch((err) => {
        expect(err).to.equal('error');
        done();
      });
  });

  it('Should promisify function with multiple inputs', async() => {
    const successFunAsync = promisify((p1, p2, cb) => {
      setTimeout(() => cb(undefined, [`${p1}-res`, `${p2}-res`]), 50);
    });

    const [response1, response2] = await successFunAsync('p1', 'p2');
    expect(response1).to.equal('p1-res');
    expect(response2).to.equal('p2-res');
  });

  it('Should handle multiple params with multiArgs option', async() => {
    const testFun = cb => cb(undefined, 'res1', 2, 'res3');
    const funAsync = promisify(testFun, { multiArgs: true });

    const [r1, r2, r3] = await funAsync();
    expect(r1).to.equal('res1');
    expect(r2).to.equal(2);
    expect(r3).to.equal('res3');
  });

  it('Should return single param if multiArgs is not provided', async() => {
    const funAsync = promisify(cb => cb(undefined, 'res1', 2));

    const response = await funAsync();
    expect(response).to.equal('res1');
  });

  it('Should handle function with no params', async() => {
    const response = await promisify(funct)();
    expect(response).to.equal(undefined);
  });

  it('Should handle function with no params and multiArgs option', async() => {
    const funAsync = promisify(funct, { multiArgs: true });

    const [res1, res2] = await funAsync();
    expect(res1).to.equal(undefined);
    expect(res2).to.equal(undefined);
  });

  it('Should handle function that throws error', (done) => {
    const errorFunAsync = promisify(() => { throw Error(); });
    errorFunAsync()
      .catch((err) => {
        expect(err).to.be.an('error');
        done();
      });
  });

  it('Should work with truthy values for multiArgs', async() => {
    const funAsync1 = promisify(funct, { multiArgs: 33 });
    const funAsync2 = promisify(funct, { multiArgs: null });

    await Promise.all([
      funAsync1()
        .then((args) => { expect(args).to.be.an('array'); })
        .catch(shouldNotBeCalled),
      funAsync2()
        .then((args) => { expect(args).to.not.be.an('array'); })
        .catch(shouldNotBeCalled),
    ]);
  });

  it('Should throw type error if function not provided', () => {
    const error = 'promisify: expected [Function] but got';
    expect(() => promisify(new Map())).to.throw(TypeError, `${error} [object Map]`);
    expect(() => promisify(undefined)).to.throw(TypeError, `${error} [object Undefined]`);
  });

  it('Should not break on invalid options', () => {
    expect(promisify(funct, undefined)()).to.be.a('promise');
    expect(promisify(funct, [])()).to.be.a('promise');
    expect(promisify(funct, null)()).to.be.a('promise');
    expect(promisify(funct, 33)()).to.be.a('promise');
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
      error(cb) { cb('error'); },
    };

    const ob1 = Object.create(mdl);
    ob1.ob1 = () => {};
    proto = Object.create(ob1);
    proto.proto = () => {};
  });

  it('Should promisify all', (done) => {
    const asyncModule = promisify.all(mdl);
    const prom1 = asyncModule.successAsync('test')
      .then((response) => {
        expect(response).to.equal('test-success');
      })
      .catch(shouldNotBeCalled);

    const prom2 = asyncModule.errorAsync()
      .then(shouldNotBeCalled)
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
    const async = promisify.all(test, { proto: true });
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
    promisify.all(proto, { proto: 33 });
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
      testAsync: (cb) => { cb(undefined, 'testAsync'); },
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
    const options = { ...baseOpt };
    promisify.all(mdl, { ...options });
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

  it('Should not duplicate promisified functions', () => {
    const test = { funct: () => {} };
    promisify.all(test);
    promisify.all(test);
    promisify.all(test);

    expect(test).to.have.all.keys(['funct', 'functAsync']);
  });
});
