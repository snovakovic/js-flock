const isApplied = {
  freeze: Object.isFrozen,
  seal: Object.isSealed,
  preventExtensions: (prop) => !Object.isExtensible(prop)
};


// Public

module.exports = function deep(action, obj, options) {
  options = options || {};
  Object[action](obj);

  for (const key in obj) {
    const prop = obj[key];
    if (prop &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      !isApplied[action](prop) &&
      (options.proto === true || obj.hasOwnProperty(key))) {
      deep(action, prop, options);
    }
  }

  return obj;
};
