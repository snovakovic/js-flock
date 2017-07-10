/* eslint-disable no-console, global-require, import/no-extraneous-dependencies */

process.chdir(__dirname); // Enable running from package script

const assert = require('assert');
const exec = require('child_process').exec;

function run(err) {
  if (err) {
    console.error('Problem with installing js-flock aborting execution', err);
    return;
  }

  const jsFlock = require('js-flock');

  // Full library load
  assert('collar' in jsFlock, true);
  assert('deepFreeze' in jsFlock, true);
  assert('deepSeal' in jsFlock, true);
  assert('promisify' in jsFlock, true);
  assert('singular' in jsFlock, true);
  assert('sort' in jsFlock, true);
  assert('toEnum' in jsFlock, true);

  // single modules load
  const collar = require('js-flock/src/collar');
  const deepFreeze = require('js-flock/src/deepFreeze');
  const deepSeal = require('js-flock/src/deepSeal');
  const promisify = require('js-flock/src/promisify');
  const singular = require('js-flock/src/singular');
  const sort = require('js-flock/src/sort');
  const toEnum = require('js-flock/src/toEnum');

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
