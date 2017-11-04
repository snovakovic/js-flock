const assertType = require('./internals/assertType')('promisify');
const isNativeObject = require('./internals/isNativeObject');

// Internals

const PROMISIFIED_SYMBOL = Symbol('promisified');

const promisified = function(fn, args, options) {
  return new Promise((resolve, reject) => {
    args.push((err, ...result) => {
      if (err) return reject(err);
      return resolve((options && options.multiArgs) ? result : result[0]);
    });

    fn.apply(this, args);
  });
};

const shouldPromisify = function(prop, key, exclude, include) {
  return typeof prop === 'function' &&
    prop[PROMISIFIED_SYMBOL] !== true &&
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

  Object.getOwnPropertyNames(cbModule).forEach((key) => {
    if (shouldPromisify(cbModule[key], key, exclude, include, proto)) {
      const asyncKey = getKey(cbModule, key, suffix);
      cbModule[asyncKey] = promisify(cbModule[key], options);
      cbModule[asyncKey][PROMISIFIED_SYMBOL] = true;
    }
  });

  // Promisify object prototype if specified
  if (proto) {
    const prototype = Object.getPrototypeOf(cbModule);
    if (proto && !isNativeObject(prototype)) {
      promisify.all(prototype, options);
    }
  }

  return cbModule;
};

// Public

module.exports = promisify;
