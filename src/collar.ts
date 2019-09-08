// >>> INTERNALS <<<

const REJECTION_REASON = Object.freeze({
  isStrangled: true,
  message: 'Promise have timed out'
});

// >>> PUBLIC <<<

/**
 * Reject promise if not resolved under provided time
 */
export default function<T>(
  promise:Promise<T>,
  ttl = 5000
) {
  const restraint = new Promise((_, reject) => {
    setTimeout(reject, ttl, REJECTION_REASON);
  }) as Promise<never>;

  return Promise.race([restraint, promise]);
};
