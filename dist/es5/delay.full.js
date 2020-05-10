(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.delay = global.delay || {}, global.delay.js = factory()));
}(this, (function () { 'use strict';

  // >>> PUBLIC <<<
  var delay = function delay() {
    var numberOfMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var delay = Number(numberOfMs);

    if (Number.isNaN(delay)) {
      var tag = Object.prototype.toString.call(numberOfMs);
      throw new TypeError("delay: expected [Number] but got ".concat(tag));
    }

    return new Promise(function (resolve) {
      setTimeout(resolve, numberOfMs);
    });
  };

  return delay;

})));
