const { expect } = require('chai');

const waitFor = require('../../src/waitFor');


describe('waitFor', () => {
  it('Should wait for value to become true', (done) => {
    let condition = false;

    waitFor(() => condition).then(() => {
      expect(condition).to.equal(true);
      done();
    });

    setTimeout(() => { condition = true; }, 5);
  });

  it('Should resolve for truthy values', (done) => {
    const ob = { test: 'test' };
    let condition;

    waitFor(() => condition).then((resolvedValue) => {
      expect(condition).to.equal(ob);
      expect(resolvedValue).to.equal(ob);
      done();
    });

    setTimeout(() => { condition = ob; }, 5);
  });

  it('Should resolve for custom comparison', (done) => {
    let condition;

    waitFor(() => condition === 55).then((resolvedValue) => {
      expect(condition).to.equal(55);
      expect(resolvedValue).to.equal(true);
      done();
    });

    setTimeout(() => { condition = 55; }, 5);
  });

  it('Should resolve multiple waitFor', (done) => {
    let condition = false;
    const p1 = waitFor(() => condition, { interval: 1 })
      .then(() => { expect(condition).to.equal(true); });
    const p2 = waitFor(() => condition, { interval: 1 })
      .then(() => { expect(condition).to.equal(true); });
    const p3 = waitFor(() => condition === 55)
      .then(() => { expect(condition).to.equal(55); });

    Promise.all([p1, p2, p3]).then(() => done());

    setTimeout(() => { condition = true; }, 5);
    setTimeout(() => { condition = 55; }, 10);
  });

  it('Should ignore invalid properties', (done) => {
    let condition = false;
    const cond = () => condition;
    const resolver = () => { expect(condition).to.equal(true); };

    Promise.all([
      waitFor(cond, null).then(resolver),
      waitFor(cond, new Map()).then(resolver),
      waitFor(cond, 'something').then(resolver),
      waitFor(cond, []).then(resolver),
      waitFor(cond, { timeout: '33', interval: '44' }).then(resolver),
      waitFor(cond, { timeout: 'aa', interval: 'bb' }).then(resolver)
    ]).then(() => done());

    setTimeout(() => { condition = true; }, 5);
  });

  it('Should preserve this', (done) => {
    const test = { continue: false };
    const bindedFun = (function() {
      return this.continue;
    }).bind(test);

    waitFor(bindedFun)
      .then(() => {
        expect(test.continue).to.equal(true);
        done();
      });

    setTimeout(() => { test.continue = true; }, 10);
  });

  it('Should throw error if function is not provided', () => {
    const error = 'waitFor: expected [Function] but got';

    expect(() => waitFor(33).to.throw(TypeError, `${error} [object Number]`));
    expect(() => waitFor(null)).to.throw(TypeError, `${error} [object Null]`);
  });

  it('Should timed out with exception', (done) => {
    let condition = false;

    waitFor(() => condition, { timeout: 5, interval: 2 })
      .catch((err) => {
        expect(err).to.be.an.instanceOf(Error).with.property('message', 'Timed out!');
        done();
      });

    setTimeout(() => { condition = true; }, 10);
  });
});
