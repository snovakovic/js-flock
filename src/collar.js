const REJECTION_REASON = Object.freeze({
  isStrangled: true,
  message: 'Promise have timed out'
});


/**
 * Set maximum waiting time for promise to resolve
 * Reject promise if it's not resolved in that time
 *
 * @param {Promise} promise promise that will be constrained with max time to resolve
 * @param {number} [ttl=5000] time to wait for promise to resolve
 * @returns {Promise}
 */
module.exports = function(promise, ttl = 5000) {
  const restraint = new Promise((resolve, reject) =>
    setTimeout(reject, ttl, REJECTION_REASON));

  return Promise.race([
    restraint,
    promise
  ]);
};
