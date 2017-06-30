const deepFreeze = require('./deepFreeze');


const fromArray = function(arr) {
  const obj = {};
  arr.forEach((key) => {
    if (typeof key !== 'string') {
      throw TypeError('Only strings are allowed in array notation');
    }
    obj[key] = key;
  });

  return obj;
};

const isStringOrNumber = (t) => typeof t === 'string' || typeof t === 'number';

const getEnumKeys = (obj) =>
  Object.keys(obj).filter((key) => isStringOrNumber(obj[key]));


/**
 * Convert object or list of strings to enum representation
 *
 * @param {Object, Array} arg Object or array of string from which we will generate enum representation
 * @returns {Object} enum representation
 */
module.exports = function(arg) {
  const obj = Array.isArray(arg) ? fromArray(arg) : arg;

  if (!obj || typeof obj !== 'object') {
    throw TypeError('Provided argument need to be object or array');
  }

  const enumKeys = Object.freeze(getEnumKeys(obj));
  const enumValues = Object.freeze(enumKeys.map((key) => obj[key]));

  // Lazy load
  const state = {
    keySet: undefined,
    valueSet: undefined
  };

  // Hard bind custom enum helpers
  Object.keys(obj)
    .filter((key) => typeof obj[key] === 'function')
    .forEach((key) => (obj[key] = obj[key].bind(obj)));

  // Append standard enum helpers

  obj.keys = () => enumKeys;
  obj.values = () => enumValues;

  obj.haveKey = (key) => {
    state.keySet = state.keySet || new Set(enumKeys);
    return state.keySet.has(key);
  };

  obj.exists = (value) => {
    state.valueSet = state.valueSet || new Set(enumValues);
    return state.valueSet.has(value);
  };

  return deepFreeze(obj);
};
