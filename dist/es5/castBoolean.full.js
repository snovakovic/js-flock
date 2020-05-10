(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.castBoolean = global.castBoolean || {}, global.castBoolean.js = factory()));
}(this, (function () { 'use strict';

  // >>> PUBLIC <<<

  /**
   * Cast any value to boolean value
   */
  var castBoolean = function castBoolean(val) {
    return val === true || val === 'true';
  };

  return castBoolean;

})));
