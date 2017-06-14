const assert = require('assert');
const exec = require('child_process').exec;

/* eslint-disable no-console, global-require, import/no-extraneous-dependencies*/
function run(err) {
  if (err) {
    console.error('Problem with installing js-flock aborting execution', err);
    return;
  }

  const jsFlock = require('js-flock');

  // Full library load
  assert('promisify' in jsFlock, true);
  assert('collar' in jsFlock, true);
  assert('toEnum' in jsFlock, true);
  assert('sort' in jsFlock, true);
  assert('deepFreeze' in jsFlock, true);
  assert('deepSeal' in jsFlock, true);

  // single modules load
  const promisify = require('js-flock/src/promisify');
  const collar = require('js-flock/src/collar');
  const toEnum = require('js-flock/src/toEnum');
  const sort = require('js-flock/src/sort');
  const deepFreeze = require('js-flock/src/deepFreeze');
  const deepSeal = require('js-flock/src/deepSeal');

  // promisify
  const promisified = promisify((cb) => { cb(undefined, 10); });
  promisified().then((data) => {
    assert.equal(data, 10);
    console.log('promisify: SUCCESS');
  });

  // collar
  collar(Promise.resolve('test'), 5)
    .then((response) => {
      assert.equal(response, 'test');
      console.log('collar: SUCCESS');
    });

  // toEnum
  const testEnum = toEnum(['TEST']);
  assert.equal(testEnum.TEST, 'TEST');
  console.log('toEnum: SUCCESS');

  // sort
  assert.deepEqual(sort([1, 4, 3]).asc(), [1, 3, 4]);
  console.log('sort: SUCCESS');

  // deepFreeze
  const frozen = deepFreeze({ a: 1 });
  assert.equal(Object.isFrozen(frozen), true);
  console.log('deepFreeze: SUCCESS');

  // deepSeal
  const sealed = deepSeal({ a: 1 });
  assert.equal(Object.isSealed(sealed), true);
  console.log('deepSeal: SUCCESS');
}

exec('npm uninstall js-flock && npm install js-flock', run);
