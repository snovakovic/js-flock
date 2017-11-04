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

const shouldPromisify = function(prop, exclude, include) {
  return typeof prop === 'function' &&
    prop[PROMISIFIED_SYMBOL] !== true &&
    (!include || include.some((k) => k === prop.name)) &&
    (!exclude || exclude.every((k) => k !== prop.name));
};

const getKey = function(obj, key, suffix) {
  const asyncKey = `${key}${suffix}`;
  return (asyncKey in obj)
    ? getKey(obj, asyncKey, 'Promisified')
    : asyncKey;
};

const promisify = function(fn, options) {
  assertType('Function', fn);

  return function(...args) {
    return promisified.call(this, fn, args, options);
  };
};

promisify.all = (obj, options) => {
  assertType('Object', obj);

  // Apply default options if not provided
  let { suffix, exclude, include, proto } = options || {}; // eslint-disable-line prefer-const
  suffix = typeof suffix === 'string' ? suffix : 'Async';
  exclude = Array.isArray(exclude) ? exclude : undefined;
  include = Array.isArray(include) ? include : undefined;

  Object.getOwnPropertyNames(obj).forEach((key) => {
    if (shouldPromisify(obj[key], exclude, include, proto)) {
      const asyncKey = getKey(obj, key, suffix);
      obj[asyncKey] = promisify(obj[key], options);
      obj[asyncKey][PROMISIFIED_SYMBOL] = true;
    }
  });

  // Promisify object prototype if specified
  if (proto) {
    const prototype = Object.getPrototypeOf(obj);
    if (proto && !isNativeObject(prototype)) {
      promisify.all(prototype, options);
    }
  }

  return obj;
};

// Public

module.exports = promisify;
