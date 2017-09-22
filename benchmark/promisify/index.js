/* eslint-disable no-console */

const Benchmark = require('benchmark');
const Bluebird = require('bluebird');
const flockPromisify = require('js-flock/promisify');
const nodePromisify = require('util').promisify;


function promisifyBenchmark() {
  return new Promise((resolve) => {
    const testFun = function(cb) {
      setTimeout(() => cb(null, 'done'), 100);
    };

    console.log('Promisify benchmark: \n');

    new Benchmark.Suite()
      .add('js-flock', () => { flockPromisify(testFun); })
      .add('bluebird', () => { Bluebird.promisify(testFun); })
      .add('node-util', () => { nodePromisify(testFun); })
      // add listeners
      .on('cycle', (event) => { console.log(String(event.target)); })
      .on('complete', function() {
        console.log(`\n Fastest is ${this.filter('fastest').map('name')} \n`);
        resolve();
      })
      // run async
      .run({ async: true });
  });
}

function promisifyAllBenchmark() {
  const testObj = {
    fn1(cb) { setTimeout(() => cb(null, 'fn1'), 100); },
    fn2(cb) { setTimeout(() => cb(null, 'fn1'), 100); },
    fn3(cb) { setTimeout(() => cb(null, 'fn1'), 100); },
    fn4(cb) { setTimeout(() => cb(null, 'fn1'), 100); }
  };

  console.log('\nPromisify all benchmark: \n');

  new Benchmark.Suite()
    .add('js-flock', () => { flockPromisify.all(Object.assign({}, testObj)); })
    .add('bluebird', () => { Bluebird.promisifyAll(testObj); })
    // add listeners
    .on('cycle', (event) => { console.log(String(event.target)); })
    .on('complete', function() {
      console.log(`\n Fastest is ${this.filter('fastest').map('name')}`);
    })
    // run async
    .run({ async: true });
}

const version = parseFloat(process.version.replace('v', ''));

if (version < 8) {
  console.warn('NODE version 8 or higher required to run this benchmark');
} else {
  promisifyBenchmark().then(promisifyAllBenchmark);
}
