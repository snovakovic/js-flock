// >>> PUBLIC <<<

/**
 * Get the last element off the array.
 * @param {any[]} arr The array of elements.
 * @param {Function} [condition] If condition is provided get the last element
 * off the array that meets condition.
 * @returns {any} The last element from array.
 */
module.exports = function(arr, condition) {
  let length = Array.isArray(arr) ? arr.length : 0;

  if (!length) return undefined;
  if (typeof condition !== 'function') return arr[length - 1];

  while (--length) {
    if (condition(arr[length])) return arr[length];
  }

  return undefined;
};
