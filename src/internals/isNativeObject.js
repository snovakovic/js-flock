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
module.exports = function(obj) {
  return !!(obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    Object.prototype.hasOwnProperty.call(obj, 'constructor') &&
    typeof obj.constructor === 'function' &&
    Function.prototype.toString.call(obj.constructor).includes('[native code]'));
};
