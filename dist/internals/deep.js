const isNativeObject = require('./isNativeObject');

// >>> PUBLIC <<<

/**
 * Recursively apply provided operation on object and all of the object properties that are either object or function.
 *
 * @param {string='freeze', 'seal', 'preventExtensions'} action - The action to be applied on object and his properties
 * @param {Object} obj - The object we want to modify
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @param {Set} [processed=new Set()] - Used internally to prevent circular references
 *
 *  @returns {Object} Initial object which now have applied actions on him
 */
module.exports = function deep(action, obj, options, processed = new Set()) {
  // Prevent circular reference
  if (processed.has(obj)) return obj;

  Object[action](obj);
  processed.add(obj);

  // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
  if (obj === Function.prototype) return obj;

  Reflect.ownKeys(obj).forEach((key) => {
    const prop = obj[key];
    if (prop &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      !ArrayBuffer.isView(prop)) { // Prevent issue with freezing buffers
      deep(action, prop, options, processed);
    }
  });

  // Freeze object prototype if specified
  if (options && typeof options === 'object' && options.proto) {
    const proto = Object.getPrototypeOf(obj);
    if (proto && !isNativeObject(proto)) {
      deep(action, proto, options, processed);
    }
  }

  return obj;
};
