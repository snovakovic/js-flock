const deepFreeze = require('./deepFreeze');

const reservedWords = new Set(['keys', 'values', 'haveKey', 'exists']);

const assert = (condition, msg) => {
  if (!condition) { throw new TypeError(`toEnum: ${msg}`); }
};

const assertUnique = (arr, values) => {
  assert(new Set(arr).size === arr.length, `Duplicate ${values} detected`);
};

const assertKeys = function(keys) {
  assert(keys.length, 'Empty enums are not allowed');
  assertUnique(keys, 'keys');
  assert(keys.every((k) => !reservedWords.has(k.toLowerCase())), `Reserved word have been used
    as key. [keys, values, haveKye, exists] are not allowed as keys`);
};

const assertValues = function(values) {
  assertUnique(values, 'values');
  assert(values.every((t) => typeof t === 'string' || typeof t === 'number'),
    'Only strings or numbers are allowed as enum values');
};

const assertType = function(args) {
  assert(args && typeof args === 'object', 'Provided value needs to be object or array');
  if (Array.isArray(args)) {
    assert(args.every((a) => typeof a === 'string'), 'Only strings are allowed in array notation');
  }
};

const fromArray = function(arr) {
  const obj = {};
  arr.forEach((key) => (obj[key] = key));
  return obj;
};


/**
 * Convert object or list of strings to enum representation
 *
 * @param {Object, Array} arg Object or array of string from which we will generate enum representation
 * @returns {Object} enum representation
 */
module.exports = function(arg) {
  assertType(arg);
  const enu = Array.isArray(arg) ? fromArray(arg) : arg;

  const keys = Object.freeze(Object.keys(enu).filter((key) => typeof enu[key] !== 'function'));
  assertKeys(keys);

  const values = Object.freeze(keys.map((key) => enu[key]));
  assertValues(values);

  // Lazy load
  const state = {
    keySet: undefined,
    valueSet: undefined
  };

  // Hard bind custom enum helpers
  Object.keys(enu)
    .filter((key) => typeof enu[key] === 'function')
    .forEach((key) => (enu[key] = enu[key].bind(enu)));

  // Append standard enum helpers

  enu.keys = () => keys;
  enu.values = () => values;

  enu.haveKey = (key) => {
    state.keySet = state.keySet || new Set(keys);
    return state.keySet.has(key);
  };

  enu.exists = (value) => {
    state.valueSet = state.valueSet || new Set(values);
    return state.valueSet.has(value);
  };

  return deepFreeze(enu);
};
