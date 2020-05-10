(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.promisify = global.promisify || {}, global.promisify.js = factory()));
}(this, (function () { 'use strict';

  // >>> PUBLIC <<<
  var assertType = function assertType(moduleName) {
    return function (type, val) {
      var tag = Object.prototype.toString.call(val); // Match both [object Function] and [object AsyncFunction]

      var throwError = type === 'Function' ? typeof val !== 'function' : "[object ".concat(type, "]") !== tag;

      if (throwError) {
        throw new TypeError("".concat(moduleName, ": expected [").concat(type, "] but got ").concat(tag));
      }
    };
  };

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    return !!(obj && (_typeof(obj) === 'object' || typeof obj === 'function') && Object.prototype.hasOwnProperty.call(obj, 'constructor') && typeof obj.constructor === 'function' && Function.prototype.toString.call(obj.constructor).includes('[native code]'));
  };

  var assertType$1 = assertType('promisify'); // >>> INTERNALS <<<

  /**
   * @const {Symbol} - Symbol to be applied on promisified functions to avoid multiple promisify of same function
   */

  var PROMISIFIED_SYMBOL = Symbol('promisified');
  /**
   * Promisified resolver for error first callback function.
   *
   * @param {Function} fn - Error first callback function we want to promisify
   * @param {Object} [options]
   * @param {boolean} [options.multiArgs=false] - Promise will resolve with array of values if true
   * @returns {Function} - Promisified version of error first callback function
   */

  var promisified = function promisified(fn, args, options) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      args.push(function (err) {
        if (err) return reject(err);

        for (var _len = arguments.length, result = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          result[_key - 1] = arguments[_key];
        }

        return resolve(options && options.multiArgs ? result : result[0]);
      });
      fn.apply(_this, args);
    });
  };
  /**
   * Check does we need to apply promisify
   *
   * @param {Object} prop - Object property we want to test
   * @param {string[]} [exclude=undefined] - List of object keys not to promisify
   * @param {string[]} [include=undefined] - Promisify only provided keys
   *
   * @returns {boolean}
   */


  var shouldPromisify = function shouldPromisify(prop, exclude, include) {
    return typeof prop === 'function' && prop[PROMISIFIED_SYMBOL] !== true && (!include || include.some(function (k) {
      return k === prop.name;
    })) && (!exclude || exclude.every(function (k) {
      return k !== prop.name;
    }));
  };
  /**
   * Promisify error first callback function.
   * Instead of taking a callback, the returned function will return a promise
   * whose fate is decided by the callback behavior of the given node function
   *
   * @param {Function} fn - Error first callback function we want to promisify
   * @param {Object} [options]
   * @param {boolean} [options.multiArgs=false] - Promise will resolve with array of values if true
   *
   * @returns {Function} - Promisified version of error first callback function
   *
   * @example
   * const async = promisify((cb) => cb(null, 'res1'));
   * async().then((response) => { console.log(response) });
   */


  var promisify = function promisify(fn, options) {
    assertType$1('Function', fn);
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return promisified.call(this, fn, args, options);
    };
  };
  /**
   * Promisify the entire object by going through the object's properties
   * and creating an async equivalent of each function on the object.
   *
   * @param {Object} obj - The object we want to promisify
   * @param {Object} [options]
   * @param {string} [options.suffix='Async'] - Suffix will be appended to original method name
   * @param {boolean} [options.multiArgs=false] - Promise will resolve with array of values if true
   * @param {boolean} [options.proto=false] - Promisify object prototype chain if true
   * @param {string[]} [options.exclude=undefined] - List of object keys not to promisify
   * @param {string[]} [options.include=undefined] - Promisify only provided keys
   *
   * @returns {Object} - Initial obj with appended promisified functions on him
   */


  promisify.all = function (obj, options) {
    assertType$1('Object', obj); // Apply default options if not provided

    var _ref = options || {},
        suffix = _ref.suffix,
        exclude = _ref.exclude,
        include = _ref.include,
        proto = _ref.proto; // eslint-disable-line prefer-const


    suffix = typeof suffix === 'string' ? suffix : 'Async';
    exclude = Array.isArray(exclude) ? exclude : undefined;
    include = Array.isArray(include) ? include : undefined;
    Object.getOwnPropertyNames(obj).forEach(function (key) {
      if (shouldPromisify(obj[key], exclude, include)) {
        var asyncKey = "".concat(key).concat(suffix);

        while (asyncKey in obj) {
          // Function has already been promisified skip it
          if (obj[asyncKey][PROMISIFIED_SYMBOL] === true) {
            return;
          }

          asyncKey = "".concat(asyncKey, "Promisified");
        }

        obj[asyncKey] = promisify(obj[key], options);
        obj[asyncKey][PROMISIFIED_SYMBOL] = true;
      }
    }); // Promisify object prototype if specified

    if (proto) {
      var prototype = Object.getPrototypeOf(obj);

      if (prototype && !isNativeObject(prototype)) {
        promisify.all(prototype, options);
      }
    }

    return obj;
  }; // >>> PUBLIC <<<


  var promisify_1 = promisify;

  return promisify_1;

})));
