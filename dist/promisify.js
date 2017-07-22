const promisified = function(fn, args, options = {}) {
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

const getKey = function(cbModule, key, suffix = 'Async') {
  const asyncKey = `${key}${suffix}`;
  if (asyncKey in cbModule) {
    return getKey(cbModule, asyncKey, 'Promisified');
  }
  return asyncKey;
};

const promisify = function(fn, options) {
  return function(...args) {
    return promisified.call(this, fn, args, options);
  };
};


// Public

module.exports = promisify;

module.exports.all = (cbModule, options = {}) => {
  for (const key in cbModule) {
    if (shouldPromisify(key, cbModule, options)) {
      const asyncKey = getKey(cbModule, key, options.suffix);
      cbModule[asyncKey] = promisify(cbModule[key], options);
      cbModule[asyncKey].__promisified__ = true;
    }
  }

  return cbModule;
};
