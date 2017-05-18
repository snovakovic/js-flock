/**
 * Promisify error first callback function
 *
 * @param {Function} fn - error first callback function we want to promisify
 * @returns {Function} Function that returns promise
 */
module.exports = function(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      try {
        fn.apply(this, args.concat((err, response) => (
          err ? reject(err) : resolve(response)
        )));
      } catch (err) {
        reject(err);
      }
    });
  };
};
