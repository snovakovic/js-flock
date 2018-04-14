// >>> PUBLIC <<<

/**
 * Mutate array by removing all items from it
 * @param {Array} arr - array that will be emptied
 */
module.exports = function(...props) {
  props.forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.splice(0, arr.length);
    }
  });

  if (props.length === 1) {
    return props[0];
  }

  return props;
};
