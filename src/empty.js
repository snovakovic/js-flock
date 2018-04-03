// >>> PUBLIC <<<

/**
 * Mutate array by removing all items from it
 * @param {Array} arr - array that will be emptied
 */
module.exports = function(arr) {
  if (Array.isArray(arr)) {
    arr.splice(0, arr.length);
  }

  return arr;
};
