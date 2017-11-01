const deep = require('./internals/deep');

// Public

/**
 * Recursively apply Object.preventExtensions on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to freeze
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @returns {Object} Returns initial object with applied Object.preventExtensions
 */
module.exports = (obj, options) => deep('preventExtensions', obj, options);
