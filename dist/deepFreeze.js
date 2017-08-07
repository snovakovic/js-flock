const deep = require('./internals/deep');

// Public

module.exports = (obj, options) => deep('freeze', obj, options);
