(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.deepPreventExtensions = global.deepPreventExtensions || {}, global.deepPreventExtensions.js = factory());
}(this, (function () { 'use strict';

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
    if (prop && ((typeof prop === 'undefined' ? 'undefined' : babelHelpers.typeof(prop)) === 'object' || typeof prop === 'function') && !isApplied[action](prop) && (options.proto || obj.hasOwnProperty(key))) {
      deep(action, prop, options);
    }
  }

  return obj;
};

// Public

var deepPreventExtensions = function deepPreventExtensions(obj, options) {
  return deep('preventExtensions', obj, options);
};

return deepPreventExtensions;

})));
