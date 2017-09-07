const assert = require('./internals/assert');
const getTag = require('./internals/getTag');
const isPlainObject = require('./internals/isPlainObject');
const isFunction = require('./internals/isFunction');


const getExpectationMessage = (expectation, actual) =>
  `promisify: expected [${expectation}] but got ${getTag(actual)}]`;

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
  return isFunction(cbModule[key]) &&
    cbModule[key].__promisified__ !== true &&
    (proto === true || cbModule.hasOwnProperty(key)) &&
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
  assert(isFunction(fn), getExpectationMessage('Function', fn));
  return function(...args) {
    return promisified.call(this, fn, args, options);
  };
};


// Public

module.exports = promisify;

module.exports.all = (cbModule, options) => {
  assert(isPlainObject(cbModule), getExpectationMessage('Object', cbModule));

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
