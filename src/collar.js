// >>> INTERNALS <<<

const REJECTION_REASON = Object.freeze({
  isStrangled: true,
  message: 'Promise have timed out',
});

// >>> PUBLIC <<<

module.exports = function(promise, ttl = 5000) {
  const restraint = new Promise((resolve, reject) => {
    setTimeout(reject, ttl, REJECTION_REASON);
  });

  return Promise.race([restraint, promise]);
};
