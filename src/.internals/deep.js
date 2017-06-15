/**
 * Recursively apply {action} to object property
 *
 * @param {Object} obj
 * @returns {Object}
 */
module.exports = function deep(obj, action, test) {
  Object[action](obj);

  Object.keys(obj).forEach((key) => {
    const prop = obj[key];
    if (prop !== null &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      !Object[test](prop)) {
      deep(prop, action, test);
    }
  });

  return obj;
};
