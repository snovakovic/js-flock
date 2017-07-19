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
/******/ ({

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(6);

var promisified = function promisified(fn, args) {
  var _this = this;

  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return new Promise(function (resolve, reject) {
    args.push(function (err) {
      for (var _len = arguments.length, result = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        result[_key - 1] = arguments[_key];
      }

      if (err) return reject(err);
      return options.multiArgs ? resolve(result) : resolve(result[0]);
    });

    fn.apply(_this, args);
  });
};

var shouldPromisify = function shouldPromisify(key, cbModule, excludeList, includeList) {
  return typeof cbModule[key] === 'function' && (!includeList || includeList.some(function (k) {
    return k === key;
  })) && (!excludeList || excludeList.every(function (k) {
    return k !== key;
  }));
};

var promisify = function promisify(fn, options) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return promisified.call(this, fn, args, options);
  };
};

/**
 * Promisify error first callback function
 *
 * @param {Function} fn - error first callback function we want to promisify
 * @returns {Function} Function that returns promise
 */
module.exports = promisify;

/**
 * Promisifies the entire object by going through the object's properties and creating an
 * promisified equivalent of each function on the object. It does not go through object prototype.
 *
 * @param {Object} cbModule - Module with error first callback functions we want to promisify
 * @returns {Object} Promisified module
 */
module.exports.all = function (cbModule) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!isPlainObject(cbModule)) {
    return cbModule;
  }

  options.suffix = options.suffix || 'Async';
  var async = options.mutate === true ? cbModule : Object.assign({}, cbModule);

  Object.keys(cbModule).forEach(function (key) {
    if (shouldPromisify(key, cbModule, options.exclude, options.include)) {
      async['' + key + options.suffix] = promisify(cbModule[key], options);
    }
  });

  return async;
};

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (testVar) {
  if (!testVar || (typeof testVar === 'undefined' ? 'undefined' : _typeof(testVar)) !== 'object') {
    return false;
  }
  return Object.prototype.toString.call(testVar) === '[object Object]';
};

/***/ })

/******/ });
});