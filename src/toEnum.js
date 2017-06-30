const deepFreeze = require('./deepFreeze');


const reservedWords = new Set(['keys', 'values', 'haveKey', 'exists']);

const isStringOrNumber = (t) => typeof t === 'string' || typeof t === 'number';

const getEnumKeys = (obj) => Object.keys(obj).filter((key) => isStringOrNumber(obj[key]));

const fromArray = function(arr) {
  const obj = {};
  arr.forEach((key) => (obj[key] = key));
  return obj;
};

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
  assert(values.every(isStringOrNumber), 'Only strings or numbers are allowed as enum values');
};

function assertType(args) {
  assert(args && typeof args === 'object', 'Provided value needs to be object or array');
  if (Array.isArray(args)) {
    assert(args.length, 'Empty array is not allowed');
    assert(args.every((a) => typeof a === 'string'), 'Only strings are allowed in array notation');
  }
}

/**
 * Convert object or list of strings to enum representation
 *
 * @param {Object, Array} arg Object or array of string from which we will generate enum representation
 * @returns {Object} enum representation
 */
module.exports = function(arg) {
  assertType(arg);
  const enumeration = Array.isArray(arg) ? fromArray(arg) : arg;

  const enumKeys = Object.freeze(getEnumKeys(enumeration));
  assertKeys(enumKeys);
  const enumValues = Object.freeze(enumKeys.map((key) => enumeration[key]));
  assertValues(enumValues);

  // Lazy load
  const state = {
    keySet: undefined,
    valueSet: undefined
  };

  // Hard bind custom enum helpers
  Object.keys(enumeration)
    .filter((key) => typeof enumeration[key] === 'function')
    .forEach((key) => (enumeration[key] = enumeration[key].bind(enumeration)));

  // Append standard enum helpers

  enumeration.keys = () => enumKeys;
  enumeration.values = () => enumValues;

  enumeration.haveKey = (key) => {
    state.keySet = state.keySet || new Set(enumKeys);
    return state.keySet.has(key);
  };

  enumeration.exists = (value) => {
    state.valueSet = state.valueSet || new Set(enumValues);
    return state.valueSet.has(value);
  };

  return deepFreeze(enumeration);
};
