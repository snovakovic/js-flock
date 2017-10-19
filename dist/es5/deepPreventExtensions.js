(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.deepPreventExtensions = global.deepPreventExtensions || {}, global.deepPreventExtensions.js = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Public

var deep = function deep(action, obj) {
  var processed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();

  Object[action](obj);

  processed.add(obj); // Prevent circular reference

  if (obj !== Function.prototype) {
    // Prevent TypeError: 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
    Reflect.ownKeys(obj).forEach(function (key) {
      var prop = obj[key];
      if (prop && ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object' || typeof prop === 'function') && !ArrayBuffer.isView(prop) && !processed.has(prop)) {
        deep(action, prop, processed);
      }
    });
  }

  return obj;
};

// Public

var deepPreventExtensions = function deepPreventExtensions(obj) {
  return deep('preventExtensions', obj);
};

return deepPreventExtensions;

})));
