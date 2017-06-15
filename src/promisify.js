const promisify = function(callbackFn, args, options = {}) {
  return new Promise((resolve, reject) => {
    args.push((err, ...result) => {
      if (err) return reject(err);
      return options.multiArgs ? resolve(result) : resolve(result[0]);
    });

    callbackFn(...args);
  });
};

/**
 * Promisify error first callback function
 *
 * @param {Function} callbackFn - error first callback function we want to promisify
 * @returns {Function} Function that returns promise
 */
module.exports = (callbackFn, options) =>
  (...args) => promisify(callbackFn, args, options);
