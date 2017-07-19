const deep = require('./.internals/deep');

/**
 * Recursively apply Object.preventExtensions.
 *
 * @param {Object} obj - object for which we want to prevent extension including all child object/functions
 * @returns {Object} object that is not extensible
 */
module.exports = (obj) => deep('preventExtensions', obj);
