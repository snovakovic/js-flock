(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['js-flock'] = {})));
}(this, (function (exports) { 'use strict';

// >>> INTERNALS <<<

var REJECTION_REASON = Object.freeze({
  isStrangled: true,
  message: 'Promise have timed out'
});

// >>> PUBLIC <<<

var collar = function collar(promise) {
  var ttl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;

  var restraint = new Promise(function (resolve, reject) {
    return setTimeout(reject, ttl, REJECTION_REASON);
  });

  return Promise.race([restraint, promise]);
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// >>> PUBLIC <<<

/**
 * A way to detect if object is native(built in) or user defined
 * Warning! Detection is not bulletproof and can be easily tricked.
 * In real word scenarios there should not be fake positives
 * @param {any} obj - Value to be tested is native object
 * @returns {boolean} - True if it's object and if it's built in JS object
 * @example
 * isNativeObject({}); \\ => false
 * isNativeObject(Object.prototype); \\ => true
 * isNativeObject(Number.prototype); \\ => true
 */
var isNativeObject = function isNativeObject(obj) {
  return !!(obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof$1(obj)) === 'object' || typeof obj === 'function') && Object.prototype.hasOwnProperty.call(obj, 'constructor') && typeof obj.constructor === 'function' && Function.prototype.toString.call(obj.constructor).includes('[native code]'));
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// >>> PUBLIC <<<

/**
 * Recursively apply provided operation on object and all of the object properties that are either object or function.
 *
 * @param {string='freeze', 'seal', 'preventExtensions'} action - The action to be applied on object and his properties
 * @param {Object} obj - The object we want to modify
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @param {Set} [processed=new Set()] - Used internally to prevent circular references
 *
 *  @returns {Object} Initial object which now have applied actions on him
 */
var deep = function deep(action, obj, options) {
  var processed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();

  // Prevent circular reference
  if (processed.has(obj)) return obj;

  Object[action](obj);
  processed.add(obj);

  // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
  if (obj === Function.prototype) return obj;

  var ownKeys = Object.getOwnPropertyNames(obj);

  // Not supported in all enviroments
  if (Object.getOwnPropertySymbols) {
    ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(obj));
  }

  ownKeys.forEach(function (key) {
    var prop = obj[key];
    if (prop && ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object' || typeof prop === 'function') && typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.isView(prop)) {
      // Prevent issue with freezing buffers
      deep(action, prop, options, processed);
    }
  });

  // Freeze object prototype if specified
  if (options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options.proto) {
    var proto = Object.getPrototypeOf(obj);
    if (proto && !isNativeObject(proto)) {
      deep(action, proto, options, processed);
    }
  }

  return obj;
};

// >>> PUBLIC <<<

/**
 * Recursively apply Object.freeze on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to freeze
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 *
 * @returns {Object} Initial object with applied Object.freeze
 */
var deepFreeze = function deepFreeze(obj, options) {
  return deep('freeze', obj, options);
};

// >>> PUBLIC <<<

/**
 * Recursively apply Object.preventExtensions on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to freeze
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 *
 * @returns {Object} Initial object with applied Object.preventExtensions
 */
var deepPreventExtensions = function deepPreventExtensions(obj, options) {
  return deep('preventExtensions', obj, options);
};

// >>> PUBLIC <<<

/**
 * Recursively apply Object.seal on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to seal
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 *
 * @returns {Object} Initial object with applied Object.seal
 */
var deepSeal = function deepSeal(obj, options) {
  return deep('seal', obj, options);
};

// >>> PUBLIC <<<

/**
 * Mutate array by removing all items from it
 * @param {Array[]} props - 1 or more arrays to empty out
 */
var empty = function empty() {
  for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
    props[_key] = arguments[_key];
  }

  props.forEach(function (arr) {
    if (Array.isArray(arr)) {
      arr.splice(0, arr.length);
    }
  });

  if (props.length === 1) {
    return props[0];
  }

  return props;
};

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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// >>> PUBLIC <<<

var assertType = function assertType(moduleName) {
  return function (type, val) {
    var tag = Object.prototype.toString.call(val);
    if ("[object " + type + "]" !== tag) {
      throw new TypeError(moduleName + ": expected [" + type + "] but got " + tag + "]");
    }
  };
};

var promisify_1 = createCommonjsModule(function (module) {
  var assertType$$1 = assertType('promisify');

  // >>> INTERNALS <<<

  /**
   * @const {Symbol} - Symbol to be applied on promisified functions to avoid multiple promisify of same function
   */
  var PROMISIFIED_SYMBOL = Symbol('promisified');

  /**
   * Promisified resolver for error first callback function.
   *
   * @param {Function} fn - Error first callback function we want to promisify
   * @param {Object} [options]
   * @param {boolean} [options.multiArgs=false] - Promise will resolve with array of values if true
   * @returns {Function} - Promisified version of error first callback function
   */
  var promisified = function promisified(fn, args, options) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      args.push(function (err) {
        for (var _len = arguments.length, result = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          result[_key - 1] = arguments[_key];
        }

        if (err) return reject(err);
        return resolve(options && options.multiArgs ? result : result[0]);
      });

      fn.apply(_this, args);
    });
  };

  /**
   * Check does we need to apply promisify
   *
   * @param {Object} prop - Object property we want to test
   * @param {string[]} [exclude=undefined] - List of object keys not to promisify
   * @param {string[]} [include=undefined] - Promisify only provided keys
   *
   * @returns {boolean}
   */
  var shouldPromisify = function shouldPromisify(prop, exclude, include) {
    return typeof prop === 'function' && prop[PROMISIFIED_SYMBOL] !== true && (!include || include.some(function (k) {
      return k === prop.name;
    })) && (!exclude || exclude.every(function (k) {
      return k !== prop.name;
    }));
  };

  /**
   * Promisify error first callback function.
   * Instead of taking a callback, the returned function will return a promise
   * whose fate is decided by the callback behavior of the given node function
   *
   * @param {Function} fn - Error first callback function we want to promisify
   * @param {Object} [options]
   * @param {boolean} [options.multiArgs=false] - Promise will resolve with array of values if true
   *
   * @returns {Function} - Promisified version of error first callback function
   *
   * @example
   * const async = promisify((cb) => cb(null, 'res1'));
   * async().then((response) => { console.log(response) });
   */
  var promisify = function promisify(fn, options) {
    assertType$$1('Function', fn);

    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return promisified.call(this, fn, args, options);
    };
  };

  /**
   * Promisify the entire object by going through the object's properties
   * and creating an async equivalent of each function on the object.
   *
   * @param {Object} obj - The object we want to promisify
   * @param {Object} [options]
   * @param {string} [options.suffix='Async'] - Suffix will be appended to original method name
   * @param {boolean} [options.multiArgs=false] - Promise will resolve with array of values if true
   * @param {boolean} [options.proto=false] - Promisify object prototype chain if true
   * @param {string[]} [options.exclude=undefined] - List of object keys not to promisify
   * @param {string[]} [options.include=undefined] - Promisify only provided keys
   *
   * @returns {Object} - Initial obj with appended promisified functions on him
   */
  promisify.all = function (obj, options) {
    assertType$$1('Object', obj);

    // Apply default options if not provided

    var _ref = options || {},
        suffix = _ref.suffix,
        exclude = _ref.exclude,
        include = _ref.include,
        proto = _ref.proto; // eslint-disable-line prefer-const


    suffix = typeof suffix === 'string' ? suffix : 'Async';
    exclude = Array.isArray(exclude) ? exclude : undefined;
    include = Array.isArray(include) ? include : undefined;

    Object.getOwnPropertyNames(obj).forEach(function (key) {
      if (shouldPromisify(obj[key], exclude, include, proto)) {
        var asyncKey = '' + key + suffix;
        while (asyncKey in obj) {
          // Function has already been promisified skip it
          if (obj[asyncKey][PROMISIFIED_SYMBOL] === true) {
            return;
          }

          asyncKey = asyncKey + 'Promisified';
        }

        obj[asyncKey] = promisify(obj[key], options);
        obj[asyncKey][PROMISIFIED_SYMBOL] = true;
      }
    });

    // Promisify object prototype if specified
    if (proto) {
      var prototype = Object.getPrototypeOf(obj);
      if (prototype && !isNativeObject(prototype)) {
        promisify.all(prototype, options);
      }
    }

    return obj;
  };

  // >>> PUBLIC <<<

  module.exports = promisify;
});

var assertType$2 = assertType('rerun');

// >>> PUBLIC <<<

var rerun = function rerun(fn) {
  assertType$2('Function', fn);

  var count = 0;
  var _stop = void 0;
  var stopHandler = void 0;
  var timeout = void 0;
  var _asLongAs = void 0;

  function run() {
    var shouldRun = !_stop && (!_asLongAs || _asLongAs(count));
    if (shouldRun) {
      count += 1;
      var shouldContinue = fn() !== false;

      if (shouldContinue) {
        setTimeout(run, timeout);
        // Don't continue to stop handler as runing is still in progress if we are her
        return;
      }
    }

    if (stopHandler) {
      stopHandler(count);
    }
  }

  return {
    every: function every(timoutInMs) {
      timoutInMs = Number(timoutInMs);
      assertType$2('Number', timoutInMs);

      var isValid = timoutInMs >= 0;

      if (!isValid) {
        throw Error('rerun: every() need to be called with positive number');
      }

      timeout = timoutInMs;
      return this;
    },
    asLongAs: function asLongAs(condition) {
      assertType$2('Function', condition);
      _asLongAs = condition;
      return this;
    },
    start: function start() {
      if (typeof timeout === 'undefined') {
        throw Error('rerun: every() is required before calling start()');
      }

      _stop = false;
      run();
      return this;
    },
    stop: function stop() {
      _stop = true;
      return this;
    },
    onStop: function onStop(_onStop) {
      assertType$2('Function', _onStop);
      stopHandler = _onStop;
      return this;
    }
  };
};

// >>> PUBLIC <<<

var singular = function singular(fn) {
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

// >>> INTERNALS <<<

var sorter = function sorter(direction, sortBy, thenBy, depth, a, b) {
  var valA = sortBy(a);
  var valB = sortBy(b);

  if (valA === valB) {
    if (thenBy && thenBy.length > depth) {
      return sorter(direction, thenBy[depth], thenBy, depth + 1, a, b);
    }
    return 0;
  }

  if (valA < valB) return -direction;
  if (valA == null) return 1;
  if (valB == null) return -1;

  return direction;
};

var emptySortBy = function emptySortBy(a) {
  return a;
};

var sort = function sort(direction, ctx) {
  var sortBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptySortBy;

  if (!Array.isArray(ctx)) return ctx;

  var _sorter = Array.isArray(sortBy) ? sorter.bind(undefined, direction, sortBy.shift(), sortBy, 0) : sorter.bind(undefined, direction, sortBy, undefined, 0);

  return ctx.sort(_sorter);
};

// >>> PUBLIC <<<

var sort_1 = function sort_1(ctx) {
  return {
    asc: function asc(sortBy) {
      return sort(1, ctx, sortBy);
    },
    desc: function desc(sortBy) {
      return sort(-1, ctx, sortBy);
    }
  };
};

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// >>> INTERNALS <<<

var castObject = function castObject(args) {
  if (Array.isArray(args)) {
    var obj = {};
    args.forEach(function (key) {
      obj[key] = Symbol(key);
    });
    return obj;
  }

  return (typeof args === 'undefined' ? 'undefined' : _typeof$2(args)) === 'object' ? Object.assign({}, args) : {};
};

var isClass = function isClass(input) {
  return (/^class /.test(Function.prototype.toString.call(input))
  );
};

var hardBindFunction = function hardBindFunction(obj, key) {
  var prop = obj[key];
  if (typeof prop === 'function' && !isClass(prop)) {
    obj[key] = prop.bind(obj);
  }
};

// >>> PUBLIC <<<

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

var assertType$3 = assertType('waitFor');

// >>> PUBLIC <<<

var waitFor = function waitFor(fn, options) {
  assertType$3('Function', fn);

  var interval = Number(options && options.interval) || 50;
  var endTime = Date.now() + (Number(options && options.timeout) || 5000);

  return new Promise(function check(resolve, reject) {
    var result = fn();

    if (result) return resolve(result);
    if (Date.now() > endTime) return reject(new Error('Timed out!'));

    return setTimeout(check, interval, resolve, reject);
  });
};

// >>> PUBLIC <<<

var src = {
  /* eslint-disable global-require */
  collar: collar,
  deepFreeze: deepFreeze,
  deepPreventExtensions: deepPreventExtensions,
  deepSeal: deepSeal,
  empty: empty,
  last: last,
  promisify: promisify_1,
  rerun: rerun,
  singular: singular,
  sort: sort_1,
  toEnum: toEnum,
  waitFor: waitFor
};

var src_1 = src.collar;
var src_2 = src.deepFreeze;
var src_3 = src.deepPreventExtensions;
var src_4 = src.deepSeal;
var src_5 = src.empty;
var src_6 = src.last;
var src_7 = src.promisify;
var src_8 = src.rerun;
var src_9 = src.singular;
var src_10 = src.sort;
var src_11 = src.toEnum;
var src_12 = src.waitFor;

exports['default'] = src;
exports.collar = src_1;
exports.deepFreeze = src_2;
exports.deepPreventExtensions = src_3;
exports.deepSeal = src_4;
exports.empty = src_5;
exports.last = src_6;
exports.promisify = src_7;
exports.rerun = src_8;
exports.singular = src_9;
exports.sort = src_10;
exports.toEnum = src_11;
exports.waitFor = src_12;

Object.defineProperty(exports, '__esModule', { value: true });

})));
