const isNativeObject = require('./isNativeObject');

// Public

module.exports = function deep(action, obj, options, processed = new Set()) {
  Object[action](obj);

  processed.add(obj); // Prevent circular reference

  if (obj !== Function.prototype) { // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
    Reflect.ownKeys(obj).forEach((key) => {
      const prop = obj[key];
      if (prop &&
        (typeof prop === 'object' || typeof prop === 'function') &&
        !ArrayBuffer.isView(prop) && !processed.has(prop)) { // Prevent issue with freezing buffers
        deep(action, prop, options, processed);
      }
    });
  }

  // Freeze object prototype is specified
  if (options && typeof options === 'object' && options.proto) {
    const proto = Object.getPrototypeOf(obj);
    !isNativeObject(proto) && deep(action, proto, options, processed);
  }

  return obj;
};
