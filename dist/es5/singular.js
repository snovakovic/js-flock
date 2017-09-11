(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.singular = global.singular || {}, global.singular.js = factory());
}(this, (function () { 'use strict';

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

return singular;

})));
