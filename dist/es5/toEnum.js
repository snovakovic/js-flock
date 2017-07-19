(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("js-flock", [], factory);
	else if(typeof exports === 'object')
		exports["js-flock"] = factory();
	else
		root["js-flock"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 9:
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var reservedWords = new Set(['keys', 'values', 'haveKey', 'exists']);

var assert = function assert(condition, msg) {
  if (!condition) {
    throw new TypeError('toEnum: ' + msg);
  }
};

var assertKeys = function assertKeys(keys) {
  assert(keys.length, 'Empty enums are not allowed');
  assert(keys.every(function (k) {
    return !reservedWords.has(k.toLowerCase());
  }), 'Reserved word have been used\n    as key. [keys, values, haveKey, exists] are not allowed as keys');
};

var assertValues = function assertValues(values) {
  assert(new Set(values).size === values.length, 'Duplicate values detected');
  assert(values.every(function (t) {
    return typeof t === 'string' || typeof t === 'number' || (typeof t === 'undefined' ? 'undefined' : _typeof(t)) === 'symbol';
  }), 'Only strings, numbers and symbols are allowed as enum values');
};

var assertType = function assertType(args) {
  assert(args && (typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object', 'Provided value need to be object or array');
  if (Array.isArray(args)) {
    assert(args.every(function (a) {
      return typeof a === 'string';
    }), 'Only strings are allowed in array notation');
  }
};

var fromArray = function fromArray(arr) {
  var obj = {};
  arr.forEach(function (key) {
    return obj[key] = Symbol(key);
  });
  return obj;
};

/**
 * Convert object or list of strings to enum representation
 *
 * @param {Object, Array} arg Object or array of string from which we will generate enum representation
 * @returns {Object} enum representation
 */
module.exports = function (arg) {
  assertType(arg);
  var enu = Array.isArray(arg) ? fromArray(arg) : arg;

  var keys = Object.freeze(Object.keys(enu).filter(function (key) {
    return typeof enu[key] !== 'function';
  }));
  assertKeys(keys);

  var values = Object.freeze(keys.map(function (key) {
    return enu[key];
  }));
  assertValues(values);

  // Lazy load
  var state = {
    keySet: undefined,
    valueSet: undefined
  };

  // Hard bind custom enum helpers
  Object.keys(enu).filter(function (key) {
    return typeof enu[key] === 'function';
  }).forEach(function (key) {
    return enu[key] = enu[key].bind(enu);
  });

  // Append standard enum helpers

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

/***/ })

/******/ });
});