const promisified = function(fn, args, options = {}) {
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
    && (!excludeList || excludeList.every((k) => k !== key));
};

const promisify = (fn, options) => (...args) => promisified(fn, args, options);

/**
 * Promisify error first callback function
 *
 * @param {Function} fn - error first callback function we want to promisify
 * @returns {Function} Function that returns promise
 */
module.exports = promisify;


module.exports.all = (cbModule, options = {}) => {
  if (!cbModule || typeof cbModule !== 'object' || Array.isArray(cbModule)) {
    return cbModule;
  }

  options.suffix = options.suffix || 'Async';
  options.mutate = typeof options.mutate === 'boolean' ? options.mutate : false;
  const async = options.mutate ? cbModule : Object.assign({}, cbModule);

  Object.keys(cbModule).forEach((key) => {
    if (shouldInclude(key, cbModule, options.exclude, options.include)) {
      async[`${key}${options.suffix}`] = promisify(cbModule[key], options);
    }
  });
  return async;
};
