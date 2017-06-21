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

  const keys = Object.freeze(getEnumKeys(obj));
  const values = Object.freeze(keys.map((key) => obj[key]));
  const keysSet = new Set(keys);
  const valuesSet = new Set(values);

  // Hard bind enum helpers
  Object.keys(obj)
    .filter((key) => typeof obj[key] === 'function')
    .forEach((key) => (obj[key] = obj[key].bind(obj)));

  // Append standard enum helpers
  obj.values = () => values;
  obj.keys = () => keys;
  obj.exists = (value) => valuesSet.has(value);
  obj.haveKey = (key) => keysSet.has(key);

  return deepFreeze(obj);
};
