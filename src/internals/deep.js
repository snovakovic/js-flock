const isFunction = require('./isFunction');


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
      (typeof prop === 'object' || isFunction(prop)) &&
      !isApplied[action](prop) &&
      (options.proto || obj.hasOwnProperty(key))) {
      deep(action, prop, options);
    }
  }

  return obj;
};
