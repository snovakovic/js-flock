const { expect } = require('chai');

const Strategy = require('../src/strategy');


describe.only('strategy', () => {
  let testStrategy;

  beforeEach(() => {
    testStrategy = new Strategy();

    testStrategy.add(() => 1).desc('Test Strategy 1').rule('st1');
    testStrategy.add(() => 2).rule('st2').desc('Test Strategy 2');
    testStrategy.add(() => 3).rule((ctx) => ctx === 'st3');
  });

  it('Should pick right strategy', () => {
    const st1 = testStrategy.get('st1');
    const st2 = testStrategy.get('st2');
    const st3 = testStrategy.get('st3');

    expect(st1.exec()).to.equal(1);
    expect(st2.exec()).to.equal(2);
    expect(st3.exec()).to.equal(3);

    expect(st1.desc).to.equal('Test Strategy 1');
    expect(st2.desc).to.equal('Test Strategy 2');
    expect(st3.desc).to.equal(undefined);
  });

  it('Should return empty strategy if no strategy is found', () => {
    const emptyStrategy = testStrategy.get('no-strategy');

    expect(emptyStrategy.exec()).to.equal(undefined);
    expect(emptyStrategy.desc).to.equal('Strategy not found');
  });

  it('Should pass parameters to strategy', () => {
    testStrategy.add((num1, num2) => num1 + num2).rule('add');
    expect(testStrategy.get('add').exec(5, 15)).to.equal(20);
  });

  it('Should throw exception if function is not provided as strategy', () => {
    const error = 'strategy: expected [Function] but got';

    expect(() => testStrategy.add(33)).to.throw(TypeError, `${error} [object Number]`);
    expect(() => testStrategy.add(null)).to.throw(TypeError, `${error} [object Null]`);
    expect(() => testStrategy.add({})).to.throw(TypeError, `${error} [object Object]`);
  });

  it('Should support destructuring', () => {
    const { desc, rule } = testStrategy.add(() => 55);
    desc('newRule');
    rule('r1');

    const newStrategy = testStrategy.get('r1');
    expect(newStrategy.exec()).to.equal(55);
    expect(newStrategy.desc).to.equal('newRule');
  });

  it('Should be immutable', () => {
    testStrategy.add = null;
    testStrategy.get = null;
    expect(testStrategy.add).to.be.an('function');
    expect(testStrategy.get).to.be.an('function');
  });

  it('Should not break if searching strategy without condition', () => {
    expect(testStrategy.get().desc).to.equal('Strategy not found');
  });
});
