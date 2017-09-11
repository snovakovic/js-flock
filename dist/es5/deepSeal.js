(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var deep = require('./internals/deep');

// Public

module.exports = function (obj, options) {
  return deep('seal', obj, options);
};

})));
