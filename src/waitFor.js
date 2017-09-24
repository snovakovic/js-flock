const assert = require('./internals/assert');
const getTag = require('./internals/getTag');


// Public

module.exports = function(fn, options) {
  assert(typeof fn === 'function', `waitFor: expected [Function] but got ${getTag(fn)}]`);
  const interval = Number(options && options.interval) || 50;
  const endTime = Date.now() + (Number(options && options.timeout) || 5000);

  return new Promise(function check(resolve, reject) {
    const result = fn();

    if (result) return resolve(result);
    if (Date.now() > endTime) return reject(new Error('Timed out!'));

    return setTimeout(check, interval, resolve, reject);
  });
};
