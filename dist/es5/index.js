(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['js-flock'] = factory());
}(this, (function () { 'use strict';

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isApplied = {
  freeze: Object.isFrozen,
  seal: Object.isSealed,
  preventExtensions: function preventExtensions(prop) {
    return !Object.isExtensible(prop);
  }
};

// Public

var deep = function deep(action, obj, options) {
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

// Public

var deepFreeze = function deepFreeze(obj, options) {
  return deep('freeze', obj, options);
};

// Public

var deepPreventExtensions = function deepPreventExtensions(obj, options) {
  return deep('preventExtensions', obj, options);
};

// Public

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

var assert = function assert(boolExpr, message) {
  if (!boolExpr) {
    throw new TypeError(message);
  }
};

// Public

var getTag = function getTag(input) {
  return Object.prototype.toString.call(input);
};

// Public

var isPlainObject = function isPlainObject(testVar) {
  return !!(testVar && getTag(testVar) === '[object Object]');
};

var promisify_1 = createCommonjsModule(function (module) {
  var getExpectationMessage = function getExpectationMessage(expectation, actual) {
    return 'promisify: expected [' + expectation + '] but got ' + getTag(actual) + ']';
  };

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
    assert(typeof fn === 'function', getExpectationMessage('Function', fn));
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return promisified.call(this, fn, args, options);
    };
  };

  promisify.all = function (cbModule, options) {
    assert(isPlainObject(cbModule), getExpectationMessage('Object', cbModule));

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

var ascSorter = sorter.bind(null, 1);
var descSorter = sorter.bind(null, -1);

var emptySortBy = function emptySortBy(a) {
  return a;
};

var sort = function sort(ctx, _sorter) {
  var sortBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptySortBy;

  if (!Array.isArray(ctx)) return ctx;

  return Array.isArray(sortBy) ? ctx.sort(_sorter.bind(undefined, sortBy.shift(), sortBy, 0)) : ctx.sort(_sorter.bind(undefined, sortBy, undefined, 0));
};

// Public

var sort_1 = function sort_1(ctx) {
  return {
    asc: function asc(sortBy) {
      return sort(ctx, ascSorter, sortBy);
    },
    desc: function desc(sortBy) {
      return sort(ctx, descSorter, sortBy);
    }
  };
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var castObject = function castObject(args) {
  if (Array.isArray(args)) {
    var obj = {};
    args.forEach(function (key) {
      obj[key] = Symbol(key);
    });
    return obj;
  }

  return (typeof args === 'undefined' ? 'undefined' : _typeof$1(args)) === 'object' ? Object.assign({}, args) : {};
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

/* eslint-disable global-require */
var src = {
  collar: collar,
  deepFreeze: deepFreeze,
  deepPreventExtensions: deepPreventExtensions,
  deepSeal: deepSeal,
  last: last,
  promisify: promisify_1,
  singular: singular,
  sort: sort_1,
  toEnum: toEnum
};

return src;

})));
