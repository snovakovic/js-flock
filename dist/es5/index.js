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

// Public

module.exports = function deep(action, obj, options) {
  options = options || {};
  Object[action](obj);

  for (var key in obj) {
    var prop = obj[key];
    if (prop && ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object' || typeof prop === 'function') && !isApplied[action](prop) && (options.proto === true || obj.hasOwnProperty(key))) {
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

// Public

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

// Public

module.exports = function (obj, options) {
  return deep('freeze', obj, options);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var deep = __webpack_require__(0);

// Public

module.exports = function (obj, options) {
  return deep('preventExtensions', obj, options);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var deep = __webpack_require__(0);

// Public

module.exports = function (obj, options) {
  return deep('seal', obj, options);
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Public

module.exports = function (testVar) {
  return !!(testVar && (typeof testVar === 'undefined' ? 'undefined' : _typeof(testVar)) === 'object' && Object.prototype.toString.call(testVar) === '[object Object]');
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

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

var shouldPromisify = function shouldPromisify(key, cbModule, _ref) {
  var exclude = _ref.exclude,
      include = _ref.include,
      proto = _ref.proto;

  return typeof cbModule[key] === 'function' && cbModule[key].__promisified__ !== true && (proto === true || cbModule.hasOwnProperty(key)) && (!include || include.some(function (k) {
    return k === key;
  })) && (!exclude || exclude.every(function (k) {
    return k !== key;
  }));
};

var getKey = function getKey(cbModule, key) {
  var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Async';

  var asyncKey = '' + key + suffix;
  if (asyncKey in cbModule) {
    return getKey(cbModule, asyncKey, 'Promisified');
  }
  return asyncKey;
};

var promisify = function promisify(fn, options) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return promisified.call(this, fn, args, options);
  };
};

// Public

module.exports = promisify;

module.exports.all = function (cbModule) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var key in cbModule) {
    if (shouldPromisify(key, cbModule, options)) {
      var asyncKey = getKey(cbModule, key, options.suffix);
      cbModule[asyncKey] = promisify(cbModule[key], options);
      cbModule[asyncKey].__promisified__ = true;
    }
  }

  return cbModule;
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// Public

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
/* 8 */
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

// Public

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
/* 9 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var castObject = function castObject(args) {
  if (Array.isArray(args)) {
    var obj = {};
    args.forEach(function (key) {
      return obj[key] = Symbol(key);
    });
    return obj;
  }

  return (typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' ? Object.assign({}, args) : {};
};

var hardBindFunction = function hardBindFunction(obj, key) {
  var prop = obj[key];
  if (typeof prop === 'function') {
    prop = prop.bind(obj);
  }
};

// Public

module.exports = function (arg) {
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
  });

  // Lazy load state

  var state = {
    keySet: undefined,
    valueSet: undefined
  };

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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports.collar = __webpack_require__(1);
exports.deepFreeze = __webpack_require__(2);
exports.deepPreventExtensions = __webpack_require__(3);
exports.deepSeal = __webpack_require__(4);
exports.isPlainObject = __webpack_require__(5);
exports.promisify = __webpack_require__(6);
exports.singular = __webpack_require__(7);
exports.sort = __webpack_require__(8);
exports.toEnum = __webpack_require__(9);

/***/ })
/******/ ]);
});