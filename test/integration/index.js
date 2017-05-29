const assert = require('assert');
const exec = require('child_process').exec;


function runTest() {
  const jsFlock = require('js-flock');

  // Colar
  jsFlock.collar(Promise.resolve('test'), 5)
    .then((response) => {
      assert.equal(response, 'test');
      console.log('COLLAR: SUCCESS');
    });

  // Deep freeze
  const frozen = jsFlock.deepFreeze({ a: 1 });
  assert.equal(Object.isFrozen(frozen), true);
  console.log('Deep Freeze: SUCCESS');

  // deepSeal
  const sealed = jsFlock.deepSeal({ a: 1 });
  assert.equal(Object.isSealed(sealed), true);
  console.log('Deep Seal: SUCCESS');

  // toEnum
  const testEnum = jsFlock.toEnum(['TEST']);
  assert.equal(testEnum.TEST, 'TEST');
  console.log('To Enum: SUCCESS');

  // Promisify
  const promisified = jsFlock.promisify((cb) => { cb(undefined, 10); });
  promisified().then((data) => {
    assert.equal(data, 10);
    console.log('PROMISIFY: SUCCESS');
  });
}

exec('npm install', (error) => {
  if (error) {
    console.error(error);
  }

  runTest();
});

