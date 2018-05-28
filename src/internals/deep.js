const isNativeObject = require('./isNativeObject');

// >>> PUBLIC <<<

/**
 * Recursively apply provided operation on object and all of the object properties that are either object or function.
 * @param {string['freeze', 'seal', 'preventExtensions']} action - The action to be applied on object and his properties
 * @param {Object} obj - The object that will be deeply freeze/seal...
 * @param {Object} [options] - Optional options that controls what will be affected with deep acion
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @param {boolean} [options.exclude=Function] - Function that decide should propery be excluded or included.
 * Function accepts key as first parametar and property context(object/function) as second parameter
 * @param {Set} [processed=new Set()] - Used internally to prevent circular references
 * @returns {Object} Initial object with aplied action(freeze/seel/preventExtension) on it
 */
module.exports = function deep(action, obj, options, processed = new Set()) {
  // Prevent circular reference
  if (processed.has(obj)) return obj;

  options = options || {};

  Object[action](obj);
  processed.add(obj);

  // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
  if (obj === Function.prototype) return obj;

  let ownKeys = Object.getOwnPropertyNames(obj);

  // Not supported in all enviroments
  if (Object.getOwnPropertySymbols) {
    ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(obj));
  }

  ownKeys.forEach((key) => {
    const prop = obj[key];
    if (prop &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.isView(prop)) && // Prevent issue with freezing buffers
      (typeof options.exclude !== 'function' || !options.exclude(key, obj))) {
      deep(action, prop, options, processed);
    }
  });

  // Freeze object prototype if specified
  if (options.proto) {
    const proto = Object.getPrototypeOf(obj);
    if (proto && !isNativeObject(proto)) {
      deep(action, proto, options, processed);
    }
  }

  return obj;
};
