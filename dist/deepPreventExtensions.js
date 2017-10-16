const deep = require('./internals/deep');

// Public

module.exports = (obj) => deep('preventExtensions', obj);
