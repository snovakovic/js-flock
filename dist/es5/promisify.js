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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(6);
var getTag = __webpack_require__(7);
var isPlainObject = __webpack_require__(8);

var promisified = function promisified(fn, args, options) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    args.push(function (err) {
      for (var _len = arguments.length, result = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        result[_key - 1] = arguments[_key];
      }

      if (err) return reject(err);
      return options && options.multiArgs ? resolve(result) : resolve(result[0]);
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
  assert(typeof fn === 'function', 'promisify: expected [Function] but got ' + getTag(fn));
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
  assert(isPlainObject(cbModule), 'promisify: expected [Object] but got ' + getTag(cbModule));

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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// Public

module.exports = function (boolExpr, message) {
  if (!boolExpr) {
    throw new TypeError(message);
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// Public

module.exports = function (input) {
  return Object.prototype.toString.call(input);
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Public

module.exports = function (testVar) {
    return !!(testVar && (typeof testVar === 'undefined' ? 'undefined' : _typeof(testVar)) === 'object' && Object.prototype.toString.call(testVar) === '[object Object]');
};

/***/ })
/******/ ]);
});