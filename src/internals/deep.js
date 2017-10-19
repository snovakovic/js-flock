// Internals

const isApplied = {
  freeze: Object.isFrozen,
  seal: Object.isSealed,
  preventExtensions: (prop) => !Object.isExtensible(prop)
};

// Public

module.exports = function deep(action, obj) {
  Object[action](obj);

  const keys = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));

  keys.forEach((key) => {
    const prop = obj !== Function.prototype && obj[key]; // Function.prototype is used to prevent following error on function prototype => TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
    if (prop &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      !isApplied[action](prop)) {
      deep(action, prop);
    }
  });

  return obj;
};
