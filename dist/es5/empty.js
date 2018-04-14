(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.empty = global.empty || {}, global.empty.js = factory());
}(this, (function () { 'use strict';

// >>> PUBLIC <<<

/**
 * Mutate array by removing all items from it
 * @param {Array} arr - array that will be emptied
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

return empty;

})));
