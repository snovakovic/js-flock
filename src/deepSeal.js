const deep = require('./.internals/deep');

/**
 * Recursively apply Object.seal.
 *
 * @param {Object} obj - object that will be sealed including all child object/functions
 * @returns {Object} sealed object
 */
module.exports = (obj) => deep(obj, 'seal', 'isSealed');
