const { assert } = require('chai');
const jsFlock = require('../../src/index');

describe('index', () => {
  it('should load all modules', () => {
    const modules = [
      'castBoolean',
      'collar',
      'deepFreeze',
      'deepPreventExtensions',
      'deepSeal',
      'delay',
      'empty',
      'last',
      'NumberIterator',
      'promiseAll',
      'promisify',
      'rerun',
      'singular',
      'sort',
      'toEnum',
      'waitFor'
    ];

    assert.hasAllKeys(jsFlock, modules);
  });
});
