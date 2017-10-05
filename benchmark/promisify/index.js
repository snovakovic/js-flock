/* eslint-disable no-console */

const Benchmark = require('benchmark');
const Bluebird = require('bluebird');
const flockPromisify = require('js-flock/promisify');
const nodePromisify = require('util').promisify;

const testFun = function(cb) {
  setTimeout(() => cb(null, 'done'), 0);
};

const promisifyBenchmark = function() {
  return new Promise((resolve) => {
    console.log('Promisify benchmark: \n');

    new Benchmark.Suite()
      .add('js-flock', () => { flockPromisify(testFun); })
      .add('bluebird', () => { Bluebird.promisify(testFun); })
      .add('node-util', () => { nodePromisify(testFun); })
      .on('cycle', (event) => { console.log(String(event.target)); })
      .on('complete', function() {
        console.log(`\n Fastest is ${this.filter('fastest').map('name')} \n`);
        resolve();
      })
      .run({ async: true });
  });
};

const promisifyAllBenchmark = function() {
  const testObj = {
    fn1: testFun,
    fn2: testFun,
    fn3: testFun,
    fn4: testFun
  };

  console.log('\nPromisify all benchmark: \n');

  return new Promise((resolve) => {
    new Benchmark.Suite()
      .add('js-flock', () => { flockPromisify.all(Object.assign({}, testObj)); })
      .add('bluebird', () => { Bluebird.promisifyAll(testObj); })
      .on('cycle', (event) => { console.log(String(event.target)); })
      .on('complete', function() {
        console.log(`\n Fastest is ${this.filter('fastest').map('name')}`);
        resolve();
      })
      .run({ async: true });
  });
};

const promisifiedExecutionBenchmark = function() {
  console.log('\nExecution of promisified functions: \n');

  const flockPromisified = flockPromisify(testFun);
  const nodePromisified = nodePromisify(testFun);
  const bluebirdPromisified = Bluebird.promisify(testFun);

  new Benchmark.Suite()
    .add('js-flock', {
      defer: true,
      fn: (deferred) => {
        flockPromisified().then(() => { deferred.resolve(); });
      }
    })
    .add('node-util', {
      defer: true,
      fn: (deferred) => {
        nodePromisified().then(() => { deferred.resolve(); });
      }
    })
    .add('bluebird', {
      defer: true,
      fn: (deferred) => {
        bluebirdPromisified().then(() => { deferred.resolve(); });
      }
    })
    .on('cycle', (event) => { console.log(String(event.target)); })
    .on('complete', function() {
      console.log(`\n Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({ async: true });
};

// Execute benchmark

const version = parseFloat(process.version.replace('v', ''));

if (version < 8) {
  throw Error('NODE version 8 or higher required to run this benchmark');
}

promisifyBenchmark()
  .then(promisifyAllBenchmark)
  .then(promisifiedExecutionBenchmark);
