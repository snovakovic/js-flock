(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.single = global.single || {}, global.single.js = factory()));
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

  var assertType$1 = assertType('rerun'); // >>> PUBLIC <<<

  var single = function single(array, predicate) {
    assertType$1('Array', array);
    var filteredArray = array;

    if (predicate) {
      assertType$1('Function', predicate);
      filteredArray = filteredArray.filter(predicate);
    }

    if (filteredArray.length > 1) {
      throw TypeError('More than one element satisfies the condition');
    }

    if (filteredArray.length === 0) {
      throw TypeError('No element satisfies the condition');
    }

    return filteredArray[0];
  };

  return single;

})));
