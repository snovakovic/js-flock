(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.waitFor = global.waitFor || {}, global.waitFor.js = factory()));
}(this, (function () { 'use strict';

  // >>> PUBLIC <<<
  var assertType = function assertType(moduleName) {
    return function (type, val) {
      var tag = Object.prototype.toString.call(val); // Match both [object Function] and [object AsyncFunction]

      var throwError = type === 'Function' ? typeof val !== 'function' : "[object ".concat(type, "]") !== tag;

      if (throwError) {
        throw new TypeError("".concat(moduleName, ": expected [").concat(type, "] but got ").concat(tag));
      }
    };
  };

  var assertType$1 = assertType('waitFor'); // >>> PUBLIC <<<

  var waitFor = function waitFor(fn, options) {
    assertType$1('Function', fn);
    var interval = Number(options && options.interval) || 50;
    var endTime = Date.now() + (Number(options && options.timeout) || 5000);
    return new Promise(function (resolve, reject) {
      var isAborted = false;

      var abort = function abort() {
        return isAborted = true;
      };

      (function check() {
        var result = fn(abort);
        if (isAborted) return;
        if (result) return resolve(result);
        if (Date.now() > endTime) return reject(new Error('Timed out!'));
        setTimeout(check, interval);
      })();
    });
  };

  return waitFor;

})));
