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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isApplied = {
  freeze: Object.isFrozen,
  seal: Object.isSealed,
  preventExtensions: function preventExtensions(prop) {
    return !Object.isExtensible(prop);
  }
};

/**
 * Recursively apply {action} to object property
 *
 * @param {Object} obj
 * @returns {Object}
 */
module.exports = function deep(action, obj, options) {
  options = options || {};
  Object[action](obj);

  for (var key in obj) {
    var prop = obj[key];
    if (prop && ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object' || typeof prop === 'function') && !isApplied[action](prop) && (options.proto || obj.hasOwnProperty(key))) {
      deep(action, prop, options);
    }
  }

  return obj;
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var REJECTION_REASON = Object.freeze({
  isStrangled: true,
  message: 'Promise have timed out'
});

/**
 * Set maximum waiting time for promise to resolve
 * Reject promise if it's not resolved in that time
 *
 * @param {Promise} promise promise that will be constrained with max time to resolve
 * @param {number} [ttl=5000] time to wait for promise to resolve
 * @returns {Promise}
 */
module.exports = function (promise) {
  var ttl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;

  var restraint = new Promise(function (resolve, reject) {
    return setTimeout(reject, ttl, REJECTION_REASON);
  });

  return Promise.race([restraint, promise]);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var deep = __webpack_require__(0);

/**
* Recursively apply Object.freez.
*
* @param {Object} obj - object that will be frozen including all child object/functions
* @returns {Object} frozen object
*/
module.exports = function (obj, options) {
  return deep('freeze', obj, options);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var deep = __webpack_require__(0);

/**
 * Recursively apply Object.seal.
 *
 * @param {Object} obj - object that will be sealed including all child object/functions
 * @returns {Object} sealed object
 */
module.exports = function (obj, options) {
  return deep('seal', obj, options);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(5);

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
/* 5 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (testVar) {
  if (!testVar || (typeof testVar === 'undefined' ? 'undefined' : _typeof(testVar)) !== 'object') {
    return false;
  }
  return Object.prototype.toString.call(testVar) === '[object Object]';
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Creates singular function that after is called can't be called again until it finishes with execution.
 * Singular functions injects done function as a first argument of original function.
 * When called done indicates that function has finished with execution and that it can be called again.
 *
 * @since 0.7.0
 * @param {Function} fn - function which execution we want to control
 * @returns {Function} Function with controlled execution
 */
module.exports = function (fn) {
  var inProgress = false;
  var done = function done() {
    return inProgress = false;
  };

  return function () {
    if (!inProgress) {
      inProgress = true;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.unshift(done);
      fn.apply(this, args);
    }
  };
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var sorter = function sorter(direction, sortBy, a, b) {
  a = sortBy(a);
  b = sortBy(b);

  if (a == null) return 1;
  if (b == null) return -1;
  if (a === b) return 0;
  if (a < b) return direction;
  return -direction;
};

var ascSorter = sorter.bind(null, -1);
var descSorter = sorter.bind(null, 1);

var emptySortBy = function emptySortBy(a) {
  return a;
};

var sort = function sort(ctx) {
  var sortBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptySortBy;
  var _sorter = arguments[2];

  if (Array.isArray(ctx)) {
    return ctx.sort(_sorter.bind(null, sortBy));
  }
  return ctx;
};

module.exports = function (ctx) {
  return {
    asc: function asc(sortBy) {
      return sort(ctx, sortBy, ascSorter);
    },
    desc: function desc(sortBy) {
      return sort(ctx, sortBy, descSorter);
    }
  };
};

/***/ }),
/* 8 */
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

/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports.collar = __webpack_require__(1);
exports.deepFreeze = __webpack_require__(2);
exports.deepSeal = __webpack_require__(3);
exports.promisify = __webpack_require__(4);
exports.singular = __webpack_require__(6);
exports.sort = __webpack_require__(7);
exports.toEnum = __webpack_require__(8);

/***/ })
/******/ ]);
});