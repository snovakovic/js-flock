(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

exports.collar = require('./collar');
exports.deepFreeze = require('./deepFreeze');
exports.deepPreventExtensions = require('./deepPreventExtensions');
exports.deepSeal = require('./deepSeal');
exports.last = require('./last');
exports.promisify = require('./promisify');
exports.singular = require('./singular');
exports.sort = require('./sort');
exports.toEnum = require('./toEnum');

})));
