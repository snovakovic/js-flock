// >>> PUBLIC <<<

/**
 * Remove all items from array
 * @param {Array[]} props - 1 or more arrays to empty out
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
