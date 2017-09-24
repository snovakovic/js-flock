(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.waitFor = global.waitFor || {}, global.waitFor.js = factory());
}(this, (function () { 'use strict';

// Public

var assert = function assert(boolExpr, message) {
  if (!boolExpr) {
    throw new TypeError(message);
  }
};

// Public

var getTag = function getTag(input) {
  return Object.prototype.toString.call(input);
};

// Public

var waitFor = function waitFor(fn, options) {
  assert(typeof fn === 'function', 'waitFor: expected [Function] but got ' + getTag(fn) + ']');
  var interval = Number(options && options.interval) || 50;
  var endTime = Date.now() + (Number(options && options.timeout) || 5000);

  return new Promise(function check(resolve, reject) {
    var result = fn();

    if (result) return resolve(result);
    if (Date.now() > endTime) return reject(new Error('Timed out!'));

    return setTimeout(check, interval, resolve, reject);
  });
};

return waitFor;

})));
