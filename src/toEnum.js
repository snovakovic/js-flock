const deepFreeze = require('./deepFreeze');


function fromArray(arr) {
  const obj = {};
  arr.forEach((key) => {
    if (typeof key !== 'string') {
      throw TypeError('Only strings are allowed in array notation');
    }
    obj[key] = key;
  });

  return obj;
}


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

  // Append enum helpers

  const keys = Object.freeze(Object.keys(obj));
  const values = Object.freeze(keys.map((key) => obj[key]));

  const keysSet = new Set(keys);
  const valuesSet = new Set(values);

  obj.values = () => values;
  obj.keys = () => keys;
  obj.exists = (value) => valuesSet.has(value);
  obj.haveKey = (key) => keysSet.has(key);

  deepFreeze(obj);

  return obj;
};
