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
var empty = function empty(arr) {
  if (Array.isArray(arr)) {
    arr.splice(0, arr.length);
  }

  return arr;
};

return empty;

})));
