const deep = require('./.internals/deep');

/**
* Recursively apply Object.freez.
*
* @param {Object} obj - object that will be frozen including all child object/functions
* @returns {Object} frozen object
*/
module.exports = (obj, options) => deep('freeze', obj, options);
