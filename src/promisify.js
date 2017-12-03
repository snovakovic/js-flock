const assertType = require('./internals/assertType')('promisify');
const isNativeObject = require('./internals/isNativeObject');

// >>> INTERNALS <<<

/**
 * @const {Symbol} - Symbol to be applied on promisified functions to avoid multiple promisify of same function
 */
const PROMISIFIED_SYMBOL = Symbol('promisified');

/**
 * Promisified resolver for error first callback function.
 *
 * @param {Function} fn - Error first callback function we want to promisify
 * @param {Object} [options]
 * @param {boolean} [options.multiArgs=false] - Promise will resolve with array of values if true
 * @returns {Function} - Promisified version of error first callback function
 */
const promisified = function(fn, args, options) {
  return new Promise((resolve, reject) => {
    args.push((err, ...result) => {
      if (err) return reject(err);
      return resolve((options && options.multiArgs) ? result : result[0]);
    });

    fn.apply(this, args);
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
const shouldPromisify = function(prop, exclude, include) {
  return typeof prop === 'function' &&
    prop[PROMISIFIED_SYMBOL] !== true &&
    (!include || include.some((k) => k === prop.name)) &&
    (!exclude || exclude.every((k) => k !== prop.name));
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
const promisify = function(fn, options) {
  assertType('Function', fn);

  return function(...args) {
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
promisify.all = (obj, options) => {
  assertType('Object', obj);

  // Apply default options if not provided
  let { suffix, exclude, include, proto } = options || {}; // eslint-disable-line prefer-const
  suffix = typeof suffix === 'string' ? suffix : 'Async';
  exclude = Array.isArray(exclude) ? exclude : undefined;
  include = Array.isArray(include) ? include : undefined;

  Object.getOwnPropertyNames(obj).forEach((key) => {
    if (shouldPromisify(obj[key], exclude, include, proto)) {
      let asyncKey = `${key}${suffix}`;
      while (asyncKey in obj) {
        // Function has already been promisified skip it
        if (obj[asyncKey][PROMISIFIED_SYMBOL] === true) {
          return;
        }

        asyncKey = `${asyncKey}Promisified`;
      }

      obj[asyncKey] = promisify(obj[key], options);
      obj[asyncKey][PROMISIFIED_SYMBOL] = true;
    }
  });

  // Promisify object prototype if specified
  if (proto) {
    const prototype = Object.getPrototypeOf(obj);
    if (prototype && !isNativeObject(prototype)) {
      promisify.all(prototype, options);
    }
  }

  return obj;
};

// >>> PUBLIC <<<

module.exports = promisify;
