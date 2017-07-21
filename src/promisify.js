const promisified = function(fn, args, options) {
  options = options || {};
  options.multiArgs = options.multiArgs || false;

  return new Promise((resolve, reject) => {
    args.push((err, ...result) => {
      if (err) return reject(err);
      return options.multiArgs ? resolve(result) : resolve(result[0]);
    });

    fn.apply(this, args);
  });
};

const shouldPromisify = function(key, cbModule, { exclude, include, proto }) {
  return typeof cbModule[key] === 'function' &&
    cbModule[key].__promisified__ !== true &&
    (proto === true || cbModule.hasOwnProperty(key)) &&
    (!include || include.some((k) => k === key)) &&
    (!exclude || exclude.every((k) => k !== key));
};

const promisify = function(fn, options) {
  return function(...args) {
    return promisified.call(this, fn, args, options);
  };
};


/**
 * Promisify error first callback function
 *
 * @param {Function} fn - error first callback function we want to promisify
 * @returns {Function} Promisifed version of function
 */
module.exports = promisify;

/**
 * Promisifies the entire object by going through the object's properties and creating an
 * promisified equivalent of each function on the object and its prototype chain
 *
 * @param {Object} cbModule - Module with error first callback functions we want to promisify
 * @returns {Object} Mutated module with new async methods
 */
module.exports.all = (cbModule, options) => {
  options = options || {};
  options.suffix = options.suffix || 'Async';

  for (const key in cbModule) {
    if (shouldPromisify(key, cbModule, options)) {
      const asyncKey = `${key}${options.suffix}`;
      cbModule[asyncKey] = promisify(cbModule[key], options);
      cbModule[asyncKey].__promisified__ = true;
    }
  }

  return cbModule;
};
