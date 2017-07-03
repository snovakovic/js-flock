const deepFreeze = require('./deepFreeze');
const enumUtil = require('./.internals/enumUtil');


/**
 * Convert object or list of strings to enum representation
 *
 * @param {Object, Array} arg Object or array of string from which we will generate enum representation
 * @returns {Object} enum representation
 */
module.exports = function(arg) {
  enumUtil.assertType(arg);
  const enu = Array.isArray(arg) ? enumUtil.fromArray(arg) : arg;

  const keys = Object.freeze(Object.keys(enu).filter((key) => typeof enu[key] !== 'function'));
  enumUtil.assertKeys(keys);

  const values = Object.freeze(keys.map((key) => enu[key]));
  enumUtil.assertValues(values);

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
