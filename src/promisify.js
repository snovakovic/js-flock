const promisify = function(callbackFn, args) {
  return new Promise((resolve, reject) => {
    args.push((err, result) => (err ? reject(err) : resolve(result)));
    callbackFn(...args);
  });
};

/**
 * Promisify error first callback function
 *
 * @param {Function} callbackFn - error first callback function we want to promisify
 * @returns {Function} Function that returns promise when called
 */
module.exports = (callbackFn) =>
  (...args) => promisify(callbackFn, args);
