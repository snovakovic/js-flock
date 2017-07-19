/* eslint-disable no-console, global-require, import/no-extraneous-dependencies, import/no-dynamic-require */

process.chdir(__dirname); // Enable running from package script

const assert = require('assert');
const exec = require('child_process').exec;

function run(err) {
  if (err) {
    console.error('Problem with installing js-flock aborting execution', err);
    return;
  }

  const modules = ['collar', 'deepFreeze', 'deepSeal', 'deepPreventExtensions', 'promisify',
    'singular', 'sort', 'toEnum'];

  const jsFlock = require('js-flock');
  const jsFLockES5 = require('js-flock/es5');

  // Full library load
  modules.forEach((name) => assert.equal(name in jsFlock, true));
  modules.forEach((name) => assert.equal(name in jsFLockES5, true));

  // ES5 Library single modules
  modules.forEach((name) => assert.equal(typeof require(`js-flock/es5/${name}`), 'function'));
  modules.forEach((name) => assert.equal(typeof require(`js-flock/es5/${name}.min`), 'function'));

  // single modules load
  const collar = require('js-flock/collar');
  const deepFreeze = require('js-flock/deepFreeze');
  const deepSeal = require('js-flock/deepSeal');
  const deepPreventExtensions = require('js-flock/deepPreventExtensions');
  const promisify = require('js-flock/promisify');
  const singular = require('js-flock/singular');
  const sort = require('js-flock/sort');
  const toEnum = require('js-flock/toEnum');

  // collar
  collar(Promise.resolve('test'), 5)
    .then((response) => {
      assert.equal(response, 'test');
      console.log('collar: SUCCESS');
    });

  // deepFreeze
  const frozen = deepFreeze({ a: 1 });
  assert.equal(Object.isFrozen(frozen), true);
  console.log('deepFreeze: SUCCESS');

  // deepSeal
  const sealed = deepSeal({ a: 1 });
  assert.equal(Object.isSealed(sealed), true);
  console.log('deepSeal: SUCCESS');

  // deepSeal
  const notExtensible = deepPreventExtensions({ a: 1 });
  assert.equal(Object.isExtensible(notExtensible), false);
  console.log('deepPreventExtensions: SUCCESS');

  // singular
  let singularCounter = 0;
  const sin = singular(() => (singularCounter += 1));
  sin();
  sin();
  assert.equal(singularCounter, 1);
  console.log('singular: SUCCESS');

  // promisify
  const promisified = promisify((cb) => { cb(undefined, 10); });
  promisified().then((data) => {
    assert.equal(data, 10);
    console.log('promisify: SUCCESS');
  });

  // toEnum
  const testEnum = toEnum({ TEST: 'TEST' });
  assert.equal(testEnum.TEST, 'TEST');
  console.log('toEnum: SUCCESS');

  // sort
  assert.deepEqual(sort([1, 4, 3]).asc(), [1, 3, 4]);
  console.log('sort: SUCCESS');
}

exec('npm uninstall js-flock && npm install --no-save js-flock', run);
