// >>> INTERNALS <<<

const REJECTION_REASON = Object.freeze({
  isStrangled: true,
  message: 'Promise have timed out'
});

// >>> PUBLIC <<<

/**
 * Reject promise if it's not resolved in time.
 * @param {Promise} promise The promise on which the constraints will be set.
 * @param {number} [ttl=5000] Time in ms in which have to resolve before rejection.
 * @returns {Promise} Promise with constraint on time to resolve.
 */
module.exports = function(promise, ttl = 5000) {
  const restraint = new Promise((resolve, reject) =>
    setTimeout(reject, ttl, REJECTION_REASON));

  return Promise.race([restraint, promise]);
};
