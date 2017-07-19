const isApplied = {
  freeze: Object.isFrozen,
  seal: Object.isSealed,
  preventExtensions: (prop) => !Object.isExtensible(prop)
};

/**
 * Recursively apply {action} to object property
 *
 * @param {Object} obj
 * @returns {Object}
 */
module.exports = function deep(action, obj) {
  Object[action](obj);

  Object.keys(obj).forEach((key) => {
    const prop = obj[key];
    if (prop !== null &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      !isApplied[action](prop)) {
      deep(action, prop);
    }
  });

  return obj;
};
