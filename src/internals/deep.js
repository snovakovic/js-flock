// Public

module.exports = function deep(action, obj, processed = new Set()) {
  Object[action](obj);

  processed.add(obj); // Prevent circular reference

  if (obj !== Function.prototype) { // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
    Reflect.ownKeys(obj).forEach((key) => {
      const prop = obj[key];
      if (prop &&
        (typeof prop === 'object' || typeof prop === 'function') &&
        !ArrayBuffer.isView(prop) && !processed.has(prop)) {
        deep(action, prop, processed);
      }
    });
  }

  return obj;
};
