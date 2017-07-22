const deep = require('./internals/deep');


// Public

module.exports = (obj, options) => deep('preventExtensions', obj, options);
