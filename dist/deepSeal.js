const deep = require('./internals/deep');

// Public

/**
 * Recursively apply Object.seal on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to seal
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @returns {Object} Returns initial object with applied Object.seal
 */
module.exports = (obj, options) => deep('seal', obj, options);
