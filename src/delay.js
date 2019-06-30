const assertType = require('./internals/assertType')('delay');

// >>> PUBLIC <<<

module.exports = function(numberOfMs = 0) {
  assertType('Number', numberOfMs);

  return new Promise((resolve) => {
    setTimeout(resolve, numberOfMs);
  });
};
