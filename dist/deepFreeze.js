const deep = require('./internals/deep');

// >>> PUBLIC <<<

/**
 * Recursively apply Object.freeze on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to freeze
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 *
 * @returns {Object} Initial object with applied Object.freeze
 */
module.exports = (obj, options) => deep('freeze', obj, options);
