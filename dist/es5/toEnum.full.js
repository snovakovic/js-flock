(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.toEnum = global.toEnum || {}, global.toEnum.js = factory()));
}(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  // >>> INTERNALS <<<
  var castObject = function castObject(args) {
    if (Array.isArray(args)) {
      var obj = {};
      args.forEach(function (key) {
        obj[key] = Symbol(key);
      });
      return obj;
    }

    return _typeof(args) === 'object' ? _objectSpread({}, args) : {};
  };

  var isClass = function isClass(input) {
    return /^class /.test(Function.prototype.toString.call(input));
  };

  var hardBindFunction = function hardBindFunction(obj, key) {
    var prop = obj[key];

    if (typeof prop === 'function' && !isClass(prop)) {
      obj[key] = prop.bind(obj);
    }
  }; // >>> PUBLIC <<<


  var toEnum = function toEnum(arg) {
    var enu = castObject(arg);
    var keys = Object.keys(enu).filter(function (key) {
      return typeof enu[key] !== 'function';
    });
    var values = keys.map(function (key) {
      return enu[key];
    });

    if (new Set(values).size !== values.length) {
      throw new TypeError('toEnum: Duplicate values detected');
    }

    Object.freeze(keys);
    Object.freeze(values);
    Object.keys(enu).forEach(function (key) {
      return hardBindFunction(enu, key);
    }); // Lazy load state

    var state = {
      keySet: undefined,
      valueSet: undefined
    }; // Append standard enum helpers

    enu.keys = function () {
      return keys;
    };

    enu.values = function () {
      return values;
    };

    enu.haveKey = function (key) {
      state.keySet = state.keySet || new Set(keys);
      return state.keySet.has(key);
    };

    enu.exists = function (value) {
      state.valueSet = state.valueSet || new Set(values);
      return state.valueSet.has(value);
    };

    return Object.freeze(enu);
  };

  return toEnum;

})));
