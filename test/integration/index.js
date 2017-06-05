const assert = require('assert');
const exec = require('child_process').exec;

/* eslint-disable no-console, global-require, import/no-extraneous-dependencies*/
function run() {
  const jsFlock = require('js-flock');

  // Promisify
  const promisified = jsFlock.promisify((cb) => { cb(undefined, 10); });
  promisified().then((data) => {
    assert.equal(data, 10);
    console.log('Promisify: SUCCESS');
  });

  // Collar
  jsFlock.collar(Promise.resolve('test'), 5)
    .then((response) => {
      assert.equal(response, 'test');
      console.log('Collar: SUCCESS');
    });

  // toEnum
  const testEnum = jsFlock.toEnum(['TEST']);
  assert.equal(testEnum.TEST, 'TEST');
  console.log('To Enum: SUCCESS');

  // Deep freeze
  const frozen = jsFlock.deepFreeze({ a: 1 });
  assert.equal(Object.isFrozen(frozen), true);
  console.log('Deep Freeze: SUCCESS');

  // deepSeal
  const sealed = jsFlock.deepSeal({ a: 1 });
  assert.equal(Object.isSealed(sealed), true);
  console.log('Deep Seal: SUCCESS');
}

exec('npm uninstall js-flock && npm install js-flock', run);
