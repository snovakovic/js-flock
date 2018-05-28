(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.deepPreventExtensions = global.deepPreventExtensions || {}, global.deepPreventExtensions.js = factory());
}(this, (function () { 'use strict';

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// >>> PUBLIC <<<

/**
 * A way to detect if object is native(built in) or user defined
 * Warning! Detection is not bulletproof and can be easily tricked.
 * In real word scenarios there should not be fake positives
 * @param {any} obj - Value to be tested is native object
 * @returns {boolean} - True if it's object and if it's built in JS object
 * @example
 * isNativeObject({}); \\ => false
 * isNativeObject(Object.prototype); \\ => true
 * isNativeObject(Number.prototype); \\ => true
 */
var isNativeObject = function isNativeObject(obj) {
  return !!(obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof$1(obj)) === 'object' || typeof obj === 'function') && Object.prototype.hasOwnProperty.call(obj, 'constructor') && typeof obj.constructor === 'function' && Function.prototype.toString.call(obj.constructor).includes('[native code]'));
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
var deep = function deep(action, obj, options) {
  var processed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();

  // Prevent circular reference
  if (processed.has(obj)) return obj;

  options = options || {};

  Object[action](obj);
  processed.add(obj);

  // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
  if (obj === Function.prototype) return obj;

  var ownKeys = Object.getOwnPropertyNames(obj);

  // Not supported in all enviroments
  if (Object.getOwnPropertySymbols) {
    ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(obj));
  }

  ownKeys.forEach(function (key) {
    var prop = obj[key];
    if (prop && ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object' || typeof prop === 'function') && typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.isView(prop) && ( // Prevent issue with freezing buffers
    typeof options.exclude !== 'function' || !options.exclude(key, obj))) {
      deep(action, prop, options, processed);
    }
  });

  // Freeze object prototype if specified
  if (options.proto) {
    var proto = Object.getPrototypeOf(obj);
    if (proto && !isNativeObject(proto)) {
      deep(action, proto, options, processed);
    }
  }

  return obj;
};

// >>> PUBLIC <<<

/**
 * Recursively apply Object.preventExtensions on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to freeze
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 *
 * @returns {Object} Initial object with applied Object.preventExtensions
 */
var deepPreventExtensions = function deepPreventExtensions(obj, options) {
  return deep('preventExtensions', obj, options);
};

return deepPreventExtensions;

})));
