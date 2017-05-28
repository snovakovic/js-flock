/**
 * Set maximum waiting time for promise to resolve
 * Reject promise if it's not resolved in that time
 *
 * @param {Promise} promise promise that will be constrained with max time to resolve
 * @param {number} [ttl=5000] time to wait for promise to resolve
 * @returns {Promise}
 */

const REJECTION_REASON = {
  isStrangled: true,
  message: 'Promises have timed out'
};

module.exports = function(promise, ttl = 5000) {
  const restraint = new Promise((resolve, reject) =>
    setTimeout(reject, ttl, REJECTION_REASON));

  return Promise.race([
    restraint,
    promise
  ]);
};
