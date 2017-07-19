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
module.exports = function deep(action, obj, options) {
  options = options || {};
  Object[action](obj);

  for (const key in obj) { // eslint-disable-line no-restricted-syntax, guard-for-in
    const prop = obj[key];
    if (prop
      && (typeof prop === 'object' || typeof prop === 'function')
      && !isApplied[action](prop)
      && (options.proto || obj.hasOwnProperty(key))) {
      deep(action, prop, options);
    }
  }

  return obj;
};
