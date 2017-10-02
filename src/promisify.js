const assertType = require('./internals/assertType')('promisify');

const promisified = function(fn, args, options) {
  return new Promise((resolve, reject) => {
    args.push((err, ...result) => {
      if (err) return reject(err);
      return resolve((options && options.multiArgs) ? result : result[0]);
    });

    fn.apply(this, args);
  });
};

const shouldPromisify = function(key, cbModule, exclude, include, proto) {
  return typeof cbModule[key] === 'function' &&
    cbModule[key].__promisified__ !== true &&
    (proto === true || Object.prototype.hasOwnProperty.call(cbModule, key)) &&
    (!include || include.some((k) => k === key)) &&
    (!exclude || exclude.every((k) => k !== key));
};

const getKey = function(cbModule, key, suffix) {
  const asyncKey = `${key}${suffix}`;
  return (asyncKey in cbModule)
    ? getKey(cbModule, asyncKey, 'Promisified')
    : asyncKey;
};

const promisify = function(fn, options) {
  assertType('Function', fn);

  return function(...args) {
    return promisified.call(this, fn, args, options);
  };
};

promisify.all = (cbModule, options) => {
  assertType('Object', cbModule);

  let { suffix, exclude, include, proto } = options || {}; // eslint-disable-line prefer-const
  suffix = typeof suffix === 'string' ? suffix : 'Async';
  exclude = Array.isArray(exclude) ? exclude : undefined;
  include = Array.isArray(include) ? include : undefined;

  for (const key in cbModule) {
    if (shouldPromisify(key, cbModule, exclude, include, proto)) {
      const asyncKey = getKey(cbModule, key, suffix);
      cbModule[asyncKey] = promisify(cbModule[key], options);
      cbModule[asyncKey].__promisified__ = true;
    }
  }

  return cbModule;
};

// Public

module.exports = promisify;
