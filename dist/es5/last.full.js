(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.last = global.last || {}, global.last.js = factory()));
}(this, (function () { 'use strict';

  // >>> PUBLIC <<<
  var last = function last(arr, condition) {
    var length = Array.isArray(arr) ? arr.length : 0;
    if (!length) return undefined;
    if (typeof condition !== 'function') return arr[length - 1];

    while (--length) {
      if (condition(arr[length])) return arr[length];
    }

    return undefined;
  };

  return last;

})));
