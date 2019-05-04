/* eslint-disable no-console, global-require, import/no-extraneous-dependencies, import/no-dynamic-require */

const Fs = require('fs');
const Path = require('path');

process.chdir(__dirname); // Enable running from package script

const assert = require('assert');
const { exec } = require('child_process');


async function testModules(modules) {
  // collar
  modules.collar(Promise.resolve('test'), 5)
    .then((response) => {
      assert.equal(response, 'test');
      console.log('collar: SUCCESS');
    });

  // deepFreeze
  const frozen = modules.deepFreeze({ a: 1 });
  assert.equal(Object.isFrozen(frozen), true);
  console.log('deepFreeze: SUCCESS');

  // deepPreventExtensions
  const notExtensible = modules.deepPreventExtensions({ a: 1 });
  assert.equal(Object.isExtensible(notExtensible), false);
  console.log('deepPreventExtensions: SUCCESS');

  // deepSeal
  const sealed = modules.deepSeal({ a: 1 });
  assert.equal(Object.isSealed(sealed), true);
  console.log('deepSeal: SUCCESS');

  // last
  assert.equal(modules.last([1, 4, 3]), 3);
  console.log('last: SUCCESS');

  // promisify
  const promisified = modules.promisify((cb) => { cb(undefined, 10); });
  promisified().then((data) => {
    assert.equal(data, 10);
    console.log('promisify: SUCCESS');
  });

  // promiseAll
  const promiseAllResponse = await modules.promiseAll({
    a: Promise.resolve(1),
    b: Promise.resolve(2)
  });

  assert.deepEqual(promiseAllResponse, {
    a: 1,
    b: 2
  });

  // singular
  let singularCounter = 0;
  const sin = modules.singular(() => { singularCounter += 1; });
  sin(); sin();
  assert.equal(singularCounter, 1);
  console.log('singular: SUCCESS');

  // sort
  assert.deepEqual(modules.sort([1, 4, 3]).asc(), [1, 3, 4]);
  console.log('sort: SUCCESS');

  // toEnum
  const testEnum = modules.toEnum({ TEST: 'TEST' });
  assert.equal(testEnum.TEST, 'TEST');
  console.log('toEnum: SUCCESS');

  // waitFor
  let waitCondition = false;
  setTimeout(() => { waitCondition = true; }, 5);
  modules.waitFor(() => waitCondition, { interval: 2 })
    .then((res) => {
      assert.equal(res, true);
      console.log('waitFor: SUCCESS');
    });

  // empty
  const arr = [1, 2, 4];
  modules.empty(arr);
  assert.equal(arr.length, 0);

  // rerun
  let counter = 0;
  modules
    .rerun(() => counter += 1)
    .every(1)
    .asLongAs(() => counter < 2)
    .start();

  setTimeout(() => assert.equal(2, 2), 25);
}

function run(err) {
  if (err) {
    console.error('Problem with installing js-flock aborting execution', err);
    return;
  }

  // Dynamically load all modules from src directory
  const sourcePats = Path.resolve(__dirname, '../../src/');
  const modules = Fs.readdirSync(sourcePats)
    .filter((file) => file.includes('.js'))
    .map((fileName) => fileName.replace('.js', ''));

  const jsFlock = require('js-flock');
  const jsFLockEs5 = require('js-flock/es5');
  const jsFLockEs5Min = require('js-flock/es5/index.min.js');

  const es6Modules = {};
  const es5Modules = {};
  const es5MinModules = {};

  modules.forEach((name) => {
    es6Modules[name] = require(`js-flock/${name}`);
    es5Modules[name] = require(`js-flock/es5/${name}`);
    es5MinModules[name] = require(`js-flock/es5/${name}.min.js`);
  });

  console.log('\n --- jsFlock full lib test-----\n ');
  testModules(jsFlock);

  console.log('\n --- jsFLockEs5 full lib test-----\n ');
  testModules(jsFLockEs5);

  console.log('\n --- jsFLockEs5Min full lib test-----\n ');
  testModules(jsFLockEs5Min);

  console.log('\n --- es6Modules test-----\n ');
  testModules(es6Modules);

  console.log('\n --- es5Modules test-----\n ');
  testModules(es5Modules);

  console.log('\n ---es5MinModules full lib test----- \n');
  testModules(es5MinModules);

  console.log('----- DONE -----');
}

exec('npm uninstall js-flock && npm install --no-save js-flock', run);
