/**
 * Recursively apply Object.seal on object and his child's.
 *
 * @param {Object} obj - object that will be sealed
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
