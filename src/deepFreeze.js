const deep = require('./.internals/deep');

module.exports = (obj, options) => deep('freeze', obj, options);
