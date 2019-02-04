const assertType = require('./internals/assertType')('waitFor');

// >>> PUBLIC <<<

module.exports = function(fn, options) {
  assertType('Function', fn);

  const interval = Number(options && options.interval) || 50;
  const endTime = Date.now() + (Number(options && options.timeout) || 5000);

  return new Promise((resolve, reject) => {
    let isAborted = false;
    const abort = () => isAborted = true;

    (function check() {
      const result = fn(abort);

      if (isAborted) return;
      if (result) return resolve(result);
      if (Date.now() > endTime) return reject(new Error('Timed out!'));

      setTimeout(check, interval);
    }());
  });
};
