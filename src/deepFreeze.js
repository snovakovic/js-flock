/**
 * Recursively apply Object.freez.
 *
 * @param {Object} obj - object that will be frozen including all child object/functions
 * @returns {Object}
 */
module.exports = function deepFreeze(obj) {
  Object.freeze(obj);

  Object.keys(obj).forEach((key) => {
    const prop = obj[key];
    if (prop !== null &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      !Object.isFrozen(prop)) {
      deepFreeze(prop);
    }
  });

  return obj;
};
