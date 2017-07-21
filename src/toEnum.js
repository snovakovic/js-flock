const fromArray = function(arr) {
  const obj = {};
  arr.forEach((key) => (obj[key] = Symbol(key)));
  return obj;
};


/**
 * Convert object or list of strings to enum representation
 *
 * @param {Object, Array} arg Object or array of string from which we will generate enum representation
 * @returns {Object} enum representation
 */
module.exports = function(arg) {
  const enu = Array.isArray(arg) ? fromArray(arg) : arg;
  const keys = Object.freeze(Object.keys(enu).filter((key) => typeof enu[key] !== 'function'));
  const values = Object.freeze(keys.map((key) => enu[key]));

  if (new Set(values).size !== values.length) {
    throw new TypeError('Duplicate values detected');
  }

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

  return Object.freeze(enu);
};
