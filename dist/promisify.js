const promisify = function(fn, args, options = {}) {
  return new Promise((resolve, reject) => {
    args.push((err, ...result) => {
      if (err) return reject(err);
      return options.multiArgs ? resolve(result) : resolve(result[0]);
    });

    fn.apply(this, args);
  });
};

const shouldInclude = function(key, cbModule, excludeList, includeList) {
  return typeof cbModule[key] === 'function'
    && (!includeList || includeList.some((k) => k === key))
    && (!excludeList || excludeList.every((k) => k === key));
};

/**
 * Promisify error first callback function
 *
 * @param {Function} fn - error first callback function we want to promisify
 * @returns {Function} Function that returns promise
 */
module.exports = (fn, options) =>
  (...args) => promisify(fn, args, options);


module.exports.all = (cbModule, options = {}) => {
  if (typeof cbModule !== 'object') {
    throw new TypeError('promisify: Promisify.all supports only objects');
  }

  const promisified = Object.assign({}, cbModule);
  options.suffix = options.suffix || 'Async';
  options.exclude = options.exclude || [];
  options.suffix = options.suffix || 'Async';

  Object.keys(cbModule).forEach((key) => {
    if (shouldInclude(key, cbModule, options.exclude, options.include)) {
      promisified[`${key}${options.suffix}`] = promisify(cbModule[key], options);
    }
  });
  return promisified;
};
