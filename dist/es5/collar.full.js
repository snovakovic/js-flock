(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.collar = global.collar || {}, global.collar.js = factory()));
}(this, (function () { 'use strict';

  // >>> INTERNALS <<<
  var REJECTION_REASON = Object.freeze({
    isStrangled: true,
    message: 'Promise have timed out'
  }); // >>> PUBLIC <<<

  var collar = function collar(promise) {
    var ttl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
    var restraint = new Promise(function (resolve, reject) {
      setTimeout(reject, ttl, REJECTION_REASON);
    });
    return Promise.race([restraint, promise]);
  };

  return collar;

})));
