(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['js-flock'] = {}));
}(this, (function (exports) { 'use strict';

  // >>> PUBLIC <<<

  /**
   * Cast any value to boolean value
   */
  var castBoolean = function castBoolean(val) {
    return val === true || val === 'true';
  };

  // >>> INTERNALS <<<
  var REJECTION_REASON = Object.freeze({
    isStrangled: true,
    message: 'Promise have timed out'
  }); // >>> PUBLIC <<<

  var collar = function collar(promise) {
    var ttl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
    var restraint = new Promise(function (resolve, reject) {
      setTimeout(reject, ttl, REJECTION_REASON);
    });
    return Promise.race([restraint, promise]);
  };

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    return !!(obj && (_typeof(obj) === 'object' || typeof obj === 'function') && Object.prototype.hasOwnProperty.call(obj, 'constructor') && typeof obj.constructor === 'function' && Function.prototype.toString.call(obj.constructor).includes('[native code]'));
  };

  function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

  /**
   * Recursively apply provided operation on object and all of the object properties that are either object or function.
   * @param {string['freeze', 'seal', 'preventExtensions']} action - The action to be applied on object and his properties
   * @param {Object} obj - The object that will be deeply freeze/seal...
   * @param {Object} [options] - Optional options that controls what will be affected with deep acion
   * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
   * @param {boolean} [options.exclude=Function] - Function that decide should propery be excluded or included.
   * Function accepts key as first parametar and property context(object/function) as second parameter
   * @param {Set} [processed=new Set()] - Used internally to prevent circular references
   * @returns {Object} Initial object with aplied action(freeze/seel/preventExtension) on it
   */

  var deep = function deep(action, obj, options) {
    var processed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();
    // Prevent circular reference
    if (processed.has(obj)) return obj;
    options = options || {};
    Object[action](obj);
    processed.add(obj); // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context

    if (obj === Function.prototype) return obj;
    var ownKeys = Object.getOwnPropertyNames(obj); // Not supported in all enviroments

    if (Object.getOwnPropertySymbols) {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(obj));
    }

    ownKeys.forEach(function (key) {
      var prop = obj[key];

      if (prop && (_typeof$1(prop) === 'object' || typeof prop === 'function') && typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.isView(prop) && ( // Prevent issue with freezing buffers
      typeof options.exclude !== 'function' || !options.exclude(key, obj))) {
        deep(action, prop, options, processed);
      }
    }); // Freeze object prototype if specified

    if (options.proto) {
      var proto = Object.getPrototypeOf(obj);

      if (proto && !isNativeObject(proto)) {
        deep(action, proto, options, processed);
      }
    }

    return obj;
  };

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
  var delay = function delay() {
    var numberOfMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var delay = Number(numberOfMs);

    if (Number.isNaN(delay)) {
      var tag = Object.prototype.toString.call(numberOfMs);
      throw new TypeError("delay: expected [Number] but got ".concat(tag));
    }

    return new Promise(function (resolve) {
      setTimeout(resolve, numberOfMs);
    });
  };

  // >>> PUBLIC <<<

  /**
   * Remove all items from array
   * @param {Array[]} props - 1 or more arrays to empty out
   */
  var empty = function empty() {
    for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
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

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // >>> PUBLIC <<<
  var Ensurer_1 = /*#__PURE__*/function () {
    function Ensurer() {
      _classCallCheck(this, Ensurer);

      this._calledMaxOnceCount = 0;
    }

    _createClass(Ensurer, [{
      key: "calledMaxOnce",
      value: function calledMaxOnce() {
        var errorMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Not allowed to be called more than once';
        this._calledMaxOnceCount += 1;

        if (this._calledMaxOnceCount > 1) {
          throw Error(errorMessage);
        }
      }
    }]);

    return Ensurer;
  }();

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

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

  // >>> PUBLIC <<<
  var NumberIterator_1 = /*#__PURE__*/function () {
    function NumberIterator() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          startFrom = _ref.startFrom;

      _classCallCheck$1(this, NumberIterator);

      this._currentNumber = Number(startFrom) || 0;
    }

    _createClass$1(NumberIterator, [{
      key: "next",
      value: function next() {
        if (this._currentNumber >= Number.MAX_SAFE_INTEGER) {
          throw Error('Number iterator exhausted');
        }

        this._currentNumber++;
        return this._currentNumber;
      }
    }, {
      key: "current",
      value: function current() {
        return this._currentNumber;
      }
    }]);

    return NumberIterator;
  }();

  // >>> PUBLIC <<<
  var promiseAll = function promiseAll(objOrArray) {
    if (Array.isArray(objOrArray)) {
      return Promise.all(objOrArray);
    }

    var objectKeys = Object.keys(objOrArray);
    var promises = objectKeys.map(function (key) {
      return objOrArray[key];
    });
    return Promise.all(promises).then(function (resolvedPromises) {
      var objResponse = {};
      resolvedPromises.forEach(function (resolvedPromise, idx) {
        objResponse[objectKeys[idx]] = resolvedPromise;
      });
      return objResponse;
    });
  };

  // >>> PUBLIC <<<
  var assertType = function assertType(moduleName) {
    return function (type, val) {
      var tag = Object.prototype.toString.call(val); // Match both [object Function] and [object AsyncFunction]

      var throwError = type === 'Function' ? typeof val !== 'function' : "[object ".concat(type, "]") !== tag;

      if (throwError) {
        throw new TypeError("".concat(moduleName, ": expected [").concat(type, "] but got ").concat(tag));
      }
    };
  };

  var assertType$1 = assertType('promisify'); // >>> INTERNALS <<<

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
        if (err) return reject(err);

        for (var _len = arguments.length, result = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          result[_key - 1] = arguments[_key];
        }

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
    assertType$1('Function', fn);
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
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
    assertType$1('Object', obj); // Apply default options if not provided

    var _ref = options || {},
        suffix = _ref.suffix,
        exclude = _ref.exclude,
        include = _ref.include,
        proto = _ref.proto; // eslint-disable-line prefer-const


    suffix = typeof suffix === 'string' ? suffix : 'Async';
    exclude = Array.isArray(exclude) ? exclude : undefined;
    include = Array.isArray(include) ? include : undefined;
    Object.getOwnPropertyNames(obj).forEach(function (key) {
      if (shouldPromisify(obj[key], exclude, include)) {
        var asyncKey = "".concat(key).concat(suffix);

        while (asyncKey in obj) {
          // Function has already been promisified skip it
          if (obj[asyncKey][PROMISIFIED_SYMBOL] === true) {
            return;
          }

          asyncKey = "".concat(asyncKey, "Promisified");
        }

        obj[asyncKey] = promisify(obj[key], options);
        obj[asyncKey][PROMISIFIED_SYMBOL] = true;
      }
    }); // Promisify object prototype if specified

    if (proto) {
      var prototype = Object.getPrototypeOf(obj);

      if (prototype && !isNativeObject(prototype)) {
        promisify.all(prototype, options);
      }
    }

    return obj;
  }; // >>> PUBLIC <<<


  var promisify_1 = promisify;

  var assertType$2 = assertType('rerun'); // >>> PUBLIC <<<

  var rerun = function rerun(fn) {
    assertType$2('Function', fn);
    var count = 0;

    var _stop;

    var stopHandler;
    var timeout;

    var _asLongAs;

    function run() {
      var shouldRun = !_stop && (!_asLongAs || _asLongAs(count));

      if (shouldRun) {
        count += 1;
        var shouldContinue = fn() !== false;

        if (shouldContinue) {
          setTimeout(run, timeout); // Don't continue to stop handler as running is still in progress if we are her

          return;
        }
      }

      if (stopHandler) {
        stopHandler(count);
      }
    }

    return {
      every: function every(timeoutInMs) {
        timeoutInMs = Number(timeoutInMs);
        assertType$2('Number', timeoutInMs);
        var isValid = timeoutInMs >= 0;

        if (!isValid) {
          throw Error('rerun: every() need to be called with positive number');
        }

        timeout = timeoutInMs;
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

  var assertType$3 = assertType('rerun'); // >>> PUBLIC <<<

  var single = function single(array, predicate) {
    assertType$3('Array', array);
    var filteredArray = array;

    if (predicate) {
      assertType$3('Function', predicate);
      filteredArray = filteredArray.filter(predicate);
    }

    if (filteredArray.length > 1) {
      throw TypeError('More than one element satisfies the condition');
    }

    if (filteredArray.length === 0) {
      throw TypeError('No element satisfies the condition');
    }

    return filteredArray[0];
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

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args.unshift(done);
        fn.apply(this, args);
      }
    };
  };

  // >>> INTERFACES <<<
  // >>> HELPERS <<<
  var castComparer = function (comparer) { return function (a, b, order) { return comparer(a, b, order) * order; }; };
  var throwInvalidConfigErrorIfTrue = function (condition, context) {
      if (condition)
          throw Error("Invalid sort config: " + context);
  };
  var unpackObjectSorter = function (sortByObj) {
      var _a = sortByObj || {}, asc = _a.asc, desc = _a.desc;
      var order = asc ? 1 : -1;
      var sortBy = (asc || desc);
      // Validate object config
      throwInvalidConfigErrorIfTrue(!sortBy, 'Expected `asc` or `desc` property');
      throwInvalidConfigErrorIfTrue(asc && desc, 'Ambiguous object with `asc` and `desc` config properties');
      var comparer = sortByObj.comparer && castComparer(sortByObj.comparer);
      return { order: order, sortBy: sortBy, comparer: comparer };
  };
  // >>> SORTERS <<<
  var multiPropertySorterProvider = function (defaultComparer) {
      return function multiPropertySorter(sortBy, sortByArr, depth, order, comparer, a, b) {
          var valA;
          var valB;
          if (typeof sortBy === 'string') {
              valA = a[sortBy];
              valB = b[sortBy];
          }
          else if (typeof sortBy === 'function') {
              valA = sortBy(a);
              valB = sortBy(b);
          }
          else {
              var objectSorterConfig = unpackObjectSorter(sortBy);
              return multiPropertySorter(objectSorterConfig.sortBy, sortByArr, depth, objectSorterConfig.order, objectSorterConfig.comparer || defaultComparer, a, b);
          }
          var equality = comparer(valA, valB, order);
          if ((equality === 0 || (valA == null && valB == null)) &&
              sortByArr.length > depth) {
              return multiPropertySorter(sortByArr[depth], sortByArr, depth + 1, order, comparer, a, b);
          }
          return equality;
      };
  };
  function getSortStrategy(sortBy, comparer, order) {
      // Flat array sorter
      if (sortBy === undefined || sortBy === true) {
          return function (a, b) { return comparer(a, b, order); };
      }
      // Sort list of objects by single object key
      if (typeof sortBy === 'string') {
          throwInvalidConfigErrorIfTrue(sortBy.includes('.'), 'String syntax not allowed for nested properties.');
          return function (a, b) { return comparer(a[sortBy], b[sortBy], order); };
      }
      // Sort list of objects by single function sorter
      if (typeof sortBy === 'function') {
          return function (a, b) { return comparer(sortBy(a), sortBy(b), order); };
      }
      // Sort by multiple properties
      if (Array.isArray(sortBy)) {
          var multiPropSorter_1 = multiPropertySorterProvider(comparer);
          return function (a, b) { return multiPropSorter_1(sortBy[0], sortBy, 1, order, comparer, a, b); };
      }
      // Unpack object config to get actual sorter strategy
      var objectSorterConfig = unpackObjectSorter(sortBy);
      return getSortStrategy(objectSorterConfig.sortBy, objectSorterConfig.comparer || comparer, objectSorterConfig.order);
  }
  var sort = function (order, ctx, sortBy, comparer) {
      var _a;
      if (!Array.isArray(ctx)) {
          return ctx;
      }
      // Unwrap sortBy if array with only 1 value to get faster sort strategy
      if (Array.isArray(sortBy) && sortBy.length < 2) {
          _a = sortBy, sortBy = _a[0];
      }
      return ctx.sort(getSortStrategy(sortBy, comparer, order));
  };
  // >>> Public <<<
  function createSortInstance(opts) {
      var comparer = castComparer(opts.comparer);
      return function (ctx) {
          return {
              /**
               * Sort array in ascending order. Mutates provided array by sorting it.
               * @example
               * sort([3, 1, 4]).asc();
               * sort(users).asc(u => u.firstName);
               * sort(users).asc([
               *   U => u.firstName
               *   u => u.lastName,
               * ]);
               */
              asc: function (sortBy) {
                  return sort(1, ctx, sortBy, comparer);
              },
              /**
               * Sort array in descending order. Mutates provided array by sorting it.
               * @example
               * sort([3, 1, 4]).desc();
               * sort(users).desc(u => u.firstName);
               * sort(users).desc([
               *   U => u.firstName
               *   u => u.lastName,
               * ]);
               */
              desc: function (sortBy) {
                  return sort(-1, ctx, sortBy, comparer);
              },
              /**
               * Sort array in ascending or descending order. It allows sorting on multiple props
               * in different order for each of them. Mutates provided array by sorting it.
               * @example
               * sort(users).by([
               *  { asc: u => u.score }
               *  { desc: u => u.age }
               * ]);
               */
              by: function (sortBy) {
                  return sort(1, ctx, sortBy, comparer);
              },
          };
      };
  }
  var defaultSort = createSortInstance({
      comparer: function (a, b, order) {
          if (a == null)
              return order;
          if (b == null)
              return -order;
          if (a < b)
              return -1;
          if (a === b)
              return 0;
          return 1;
      },
  });
  // Attach createNewInstance to sort function
  defaultSort['createNewInstance'] = createSortInstance;

  var sort_es = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': defaultSort
  });

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var sort$1 = getCjsExportFromNamespace(sort_es);

  /*
   * Sorce code and more ingo in https://github.com/snovakovic/fast-sort
   * NOTE: fast-sort originated in js-flock but was moved to dedicated repo at some point
  */

  var sort_1 = sort$1;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

  // >>> INTERNALS <<<
  var castObject = function castObject(args) {
    if (Array.isArray(args)) {
      var obj = {};
      args.forEach(function (key) {
        obj[key] = Symbol(key);
      });
      return obj;
    }

    return _typeof$2(args) === 'object' ? _objectSpread({}, args) : {};
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

  var assertType$4 = assertType('waitFor'); // >>> PUBLIC <<<

  var waitFor = function waitFor(fn, options) {
    assertType$4('Function', fn);
    var interval = Number(options && options.interval) || 50;
    var endTime = Date.now() + (Number(options && options.timeout) || 5000);
    return new Promise(function (resolve, reject) {
      var isAborted = false;

      var abort = function abort() {
        return isAborted = true;
      };

      (function check() {
        var result = fn(abort);
        if (isAborted) return;
        if (result) return resolve(result);
        if (Date.now() > endTime) return reject(new Error('Timed out!'));
        setTimeout(check, interval);
      })();
    });
  };

  var src = {
    /* eslint-disable global-require */
    castBoolean: castBoolean,
    collar: collar,
    deepFreeze: deepFreeze,
    deepPreventExtensions: deepPreventExtensions,
    deepSeal: deepSeal,
    delay: delay,
    empty: empty,
    Ensurer: Ensurer_1,
    last: last,
    NumberIterator: NumberIterator_1,
    promiseAll: promiseAll,
    promisify: promisify_1,
    rerun: rerun,
    single: single,
    singular: singular,
    sort: sort_1,
    toEnum: toEnum,
    waitFor: waitFor
  };
  var src_1 = src.castBoolean;
  var src_2 = src.collar;
  var src_3 = src.deepFreeze;
  var src_4 = src.deepPreventExtensions;
  var src_5 = src.deepSeal;
  var src_6 = src.delay;
  var src_7 = src.empty;
  var src_8 = src.Ensurer;
  var src_9 = src.last;
  var src_10 = src.NumberIterator;
  var src_11 = src.promiseAll;
  var src_12 = src.promisify;
  var src_13 = src.rerun;
  var src_14 = src.single;
  var src_15 = src.singular;
  var src_16 = src.sort;
  var src_17 = src.toEnum;
  var src_18 = src.waitFor;

  exports.Ensurer = src_8;
  exports.NumberIterator = src_10;
  exports.castBoolean = src_1;
  exports.collar = src_2;
  exports.deepFreeze = src_3;
  exports.deepPreventExtensions = src_4;
  exports.deepSeal = src_5;
  exports.default = src;
  exports.delay = src_6;
  exports.empty = src_7;
  exports.last = src_9;
  exports.promiseAll = src_11;
  exports.promisify = src_12;
  exports.rerun = src_13;
  exports.single = src_14;
  exports.singular = src_15;
  exports.sort = src_16;
  exports.toEnum = src_17;
  exports.waitFor = src_18;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
