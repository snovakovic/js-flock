(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['js-flock'] = factory());
}(this, (function () { 'use strict';

// Internals

var REJECTION_REASON = Object.freeze({
  isStrangled: true,
  message: 'Promise have timed out'
});

// Public

var collar = function collar(promise) {
  var ttl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;

  var restraint = new Promise(function (resolve, reject) {
    return setTimeout(reject, ttl, REJECTION_REASON);
  });

  return Promise.race([restraint, promise]);
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Public

/**
 * A way to detect if object is native or user defined
 * Warning! Detection is not bulletproof and can be easily tricked.
 * In real word scenarios there should not be fake positives
 *
 * @param {any} obj - preform isNativeObject check on provided value
 * @returns {boolean} - true if object is native false otherwise
 *
 * @example
 * isNativeObject({}); \\ => false
 * isNativeObject(Object.prototype); \\ => true
 * isNativeObject(Number.prototype); \\ => true
 */
var isNativeObject = function isNativeObject(obj) {
  return !!(obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof$1(obj)) === 'object' || typeof obj === 'function') && Object.prototype.hasOwnProperty.call(obj, 'constructor') && typeof obj.constructor === 'function' && Function.prototype.toString.call(obj.constructor).includes('[native code]'));
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Public

/**
 * Recursively apply provided operation on object and all of the object properties that are either object or function.
 *
 * @param {string='freeze', 'seal', 'preventExtensions'} action - The action to be applied on object and his properties
 * @param {Object} obj - The object we want to modify
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @param {Set} [processed=new Set()] - Used internally to prevent circular references
 * @returns {Object} Returns initial object which now have applied actions on him
 */
var deep = function deep(action, obj, options) {
  var processed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();

  // Prevent circular reference
  if (processed.has(obj)) return obj;

  Object[action](obj);
  processed.add(obj);

  // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
  if (obj === Function.prototype) return obj;

  Reflect.ownKeys(obj).forEach(function (key) {
    var prop = obj[key];
    if (prop && ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object' || typeof prop === 'function') && !ArrayBuffer.isView(prop)) {
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

// Public

var deepFreeze = function deepFreeze(obj, options) {
  return deep('freeze', obj, options);
};

// Public

/**
 * Recursively apply Object.preventExtensions on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to freeze
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @returns {Object} Returns initial object with applied Object.preventExtensions
 */
var deepPreventExtensions = function deepPreventExtensions(obj, options) {
  return deep('preventExtensions', obj, options);
};

// Public

/**
 * Recursively apply Object.seal on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to seal
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @returns {Object} Returns initial object with applied Object.seal
 */
var deepSeal = function deepSeal(obj, options) {
  return deep('seal', obj, options);
};

// Public

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

// Public

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

  // Internals

  var PROMISIFIED_SYMBOL = Symbol('promisified');

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

  var shouldPromisify = function shouldPromisify(key, cbModule, exclude, include, proto) {
    return typeof cbModule[key] === 'function' && cbModule[key][PROMISIFIED_SYMBOL] !== true && (proto === true || Object.prototype.hasOwnProperty.call(cbModule, key)) && (!include || include.some(function (k) {
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
    assertType$$1('Function', fn);

    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return promisified.call(this, fn, args, options);
    };
  };

  promisify.all = function (cbModule, options) {
    assertType$$1('Object', cbModule);

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
        cbModule[asyncKey][PROMISIFIED_SYMBOL] = true;
      }
    }

    return cbModule;
  };

  // Public

  module.exports = promisify;
});

// Public

var singular = function singular(fn) {
  var inProgress = false;
  var done = function done() {
    inProgress = false;
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

// Internals

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

// Public

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

// Internals

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

var hardBindFunction = function hardBindFunction(obj, key) {
  var prop = obj[key];
  if (typeof prop === 'function') {
    prop = prop.bind(obj);
  }
};

// Public

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

var assertType$2 = assertType('waitFor');

// Public

var waitFor = function waitFor(fn, options) {
  assertType$2('Function', fn);

  var interval = Number(options && options.interval) || 50;
  var endTime = Date.now() + (Number(options && options.timeout) || 5000);

  return new Promise(function check(resolve, reject) {
    var result = fn();

    if (result) return resolve(result);
    if (Date.now() > endTime) return reject(new Error('Timed out!'));

    return setTimeout(check, interval, resolve, reject);
  });
};

// Public

var src = {
  /* eslint-disable global-require */
  collar: collar,
  deepFreeze: deepFreeze,
  deepPreventExtensions: deepPreventExtensions,
  deepSeal: deepSeal,
  last: last,
  promisify: promisify_1,
  singular: singular,
  sort: sort_1,
  toEnum: toEnum,
  waitFor: waitFor
};

return src;

})));
