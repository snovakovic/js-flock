const isFunction = require('./internals/isFunction');


// Public

module.exports = function(arr, condition) {
  if (!arr || !arr.length) {
    return undefined;
  }

  let length = arr.length;
  if (!isFunction(condition)) {
    return arr[length - 1];
  }

  while (--length) {
    if (condition(arr[length])) return arr[length];
  }

  return undefined;
};
