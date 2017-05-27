/**
 * Recursively apply Object.seal.
 *
 * @param {Object} obj - object that will be sealed including all child object/functions
 * @returns {Object}
 */
module.exports = function deepSeal(obj) {
  Object.seal(obj);

  Object.keys(obj).forEach((key) => {
    const prop = obj[key];
    if (prop !== null &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      !Object.isSealed(prop)) {
      deepSeal(prop);
    }
  });

  return obj;
};
