(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.deepFreeze = global.deepFreeze || {}, global.deepFreeze.js = factory());
}(this, (function () { 'use strict';

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Public

/**
 * A way to detect if object is native or user defined
 * Warning! Detection is not bulletproof and can be easily tricked.
 * In real word scenarios there should not be fake positives
 *
 * @param {any} obj - preform isNativeObject check on provided value
 * @returns {boolean} - true if object is native false otherwise
 *
 * @example
 * isNativeObject({}); \\ => false
 * isNativeObject(Object.prototype); \\ => true
 * isNativeObject(Number.prototype); \\ => true
 */
var isNativeObject = function isNativeObject(obj) {
  return !!(obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof$1(obj)) === 'object' || typeof obj === 'function') && Object.prototype.hasOwnProperty.call(obj, 'constructor') && typeof obj.constructor === 'function' && Function.prototype.toString.call(obj.constructor).includes('[native code]'));
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Public

/**
 * Recursively apply provided operation on object and all of the object properties that are either object or function.
 *
 * @param {string='freeze', 'seal', 'preventExtensions'} action - The action to be applied on object and his properties
 * @param {Object} obj - The object we want to modify
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @param {Set} [processed=new Set()] - Used internally to prevent circular references
 * @returns {Object} Returns initial object which now have applied actions on him
 */
var deep = function deep(action, obj, options) {
  var processed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();

  // Prevent circular reference
  if (processed.has(obj)) return obj;

  Object[action](obj);
  processed.add(obj);

  // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
  if (obj === Function.prototype) return obj;

  Reflect.ownKeys(obj).forEach(function (key) {
    var prop = obj[key];
    if (prop && ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object' || typeof prop === 'function') && !ArrayBuffer.isView(prop)) {
      // Prevent issue with freezing buffers
      deep(action, prop, options, processed);
    }
  });

  // Freeze object prototype if specified
  if (options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options.proto) {
    var proto = Object.getPrototypeOf(obj);
    if (proto && !isNativeObject(proto)) {
      deep(action, proto, options, processed);
    }
  }

  return obj;
};

// Public

var deepFreeze = function deepFreeze(obj, options) {
  return deep('freeze', obj, options);
};

return deepFreeze;

})));
