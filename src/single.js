const assertType = require('./internals/assertType')('rerun');

// >>> PUBLIC <<<

module.exports = function(array, predicate) {
  assertType('Array', array);
  let filteredArray = array;

  if (predicate) {
    assertType('Function', predicate);
    filteredArray = filteredArray.filter(predicate);
  }

  if (filteredArray.length > 1) {
    throw TypeError('More than one element satisfies the condition');
  }
  if (filteredArray.length === 0) {
    throw TypeError('No element satisfies the condition');
  }

  return filteredArray[0];
};
