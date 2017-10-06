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

  it('Should not break when searching strategy without condition', () => {
    expect(testStrategy.get().desc).to.equal('Strategy not found');
  });

  it('Should use default strategy if no strategy is found', () => {
    expect(testStrategy.get('no-strategy').desc).to.equal('Strategy not found');
    testStrategy.add(() => { }).desc('Default Strategy').default();
    expect(testStrategy.get('no-strategy').desc).to.equal('Default Strategy');
  });

  it('Should throw exception for multiple default strategies', () => {
    testStrategy.add(() => { }).default();
    expect(() => testStrategy.add(() => { }).default())
      .to.throw(Error, 'strategy: Multiple defaults are not allowed.');
  });

  it('Should return list of strategies in progress mode', () => {
    const multi = new Strategy({ progress: true });

    multi.add(() => { }).rule((a) => a % 2 === 0).desc('Even number strategy');
    multi.add(() => { }).rule((a) => a % 2 !== 0).desc('Odd number strategy');
    multi.add(() => { }).rule((a) => a < 10).desc('less then 10 strategy');


    multi.add(() => {}).default();

    const st4 = multi.get(4);
    const st5 = multi.get(5);
    const st13 = multi.get(13);

    expect(st4.length).to.equal(2);
    expect(st4[0].desc).to.equal('Even number strategy');
    expect(st4[1].desc).to.equal('less then 10 strategy');

    expect(st5.length).to.equal(2);
    expect(st5[0].desc).to.equal('Odd number strategy');
    expect(st5[1].desc).to.equal('less then 10 strategy');

    expect(st13.length).to.equal(1);
    expect(st13[0].desc).to.equal('Odd number strategy');
  });

  it('Should execute multiple strategies with exec helper', () => {
    let sideEffect1;
    let sideEffect2;

    const multi = new Strategy({ progress: true });

    multi.add(() => { sideEffect1 = 1; }).rule(() => true);
    multi.add(() => { sideEffect2 = 2; }).rule(() => true);

    multi.get().exec();

    expect(sideEffect1).to.equal(1);
    expect(sideEffect2).to.equal(2);
  });

  it('Should return empty array for no strategy found in advance mode', () => {
    const multi = new Strategy({ progress: true });
    expect(multi.get('something')).to.eql([]);
  });
});
