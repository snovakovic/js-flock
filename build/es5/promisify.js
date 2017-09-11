(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var assert = require('./internals/assert');
var getTag = require('./internals/getTag');
var isPlainObject = require('./internals/isPlainObject');

var getExpectationMessage = function getExpectationMessage(expectation, actual) {
  return 'promisify: expected [' + expectation + '] but got ' + getTag(actual) + ']';
};

var promisified = function promisified(fn, args, options) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    args.push(function (err) {
      for (var _len = arguments.length, result = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        result[_key - 1] = arguments[_key];
      }

      if (err) return reject(err);
      return resolve(options && options.multiArgs ? result : result[0]);
    });

    fn.apply(_this, args);
  });
};

var shouldPromisify = function shouldPromisify(key, cbModule, exclude, include, proto) {
  return typeof cbModule[key] === 'function' && cbModule[key].__promisified__ !== true && (proto === true || cbModule.hasOwnProperty(key)) && (!include || include.some(function (k) {
    return k === key;
  })) && (!exclude || exclude.every(function (k) {
    return k !== key;
  }));
};

var getKey = function getKey(cbModule, key, suffix) {
  var asyncKey = '' + key + suffix;
  return asyncKey in cbModule ? getKey(cbModule, asyncKey, 'Promisified') : asyncKey;
};

var promisify = function promisify(fn, options) {
  assert(typeof fn === 'function', getExpectationMessage('Function', fn));
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return promisified.call(this, fn, args, options);
  };
};

// Public

module.exports = promisify;

module.exports.all = function (cbModule, options) {
  assert(isPlainObject(cbModule), getExpectationMessage('Object', cbModule));

  var _ref = options || {},
      suffix = _ref.suffix,
      exclude = _ref.exclude,
      include = _ref.include,
      proto = _ref.proto; // eslint-disable-line prefer-const


  suffix = typeof suffix === 'string' ? suffix : 'Async';
  exclude = Array.isArray(exclude) ? exclude : undefined;
  include = Array.isArray(include) ? include : undefined;

  for (var key in cbModule) {
    if (shouldPromisify(key, cbModule, exclude, include, proto)) {
      var asyncKey = getKey(cbModule, key, suffix);
      cbModule[asyncKey] = promisify(cbModule[key], options);
      cbModule[asyncKey].__promisified__ = true;
    }
  }

  return cbModule;
};

})));
