const isFunction = require('./internals/isFunction');


// Public

module.exports = function(arr, condition) {
  let length = Array.isArray(arr) ? arr.length : 0;

  if (!length) return undefined;

  if (!isFunction(condition)) return arr[length - 1];

  while (--length) {
    if (condition(arr[length])) return arr[length];
  }

  return undefined;
};
