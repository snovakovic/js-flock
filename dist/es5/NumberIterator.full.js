(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.NumberIterator = global.NumberIterator || {}, global.NumberIterator.js = factory()));
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // >>> PUBLIC <<<
  var NumberIterator_1 = /*#__PURE__*/function () {
    function NumberIterator() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          startFrom = _ref.startFrom;

      _classCallCheck(this, NumberIterator);

      this._currentNumber = Number(startFrom) || 0;
    }

    _createClass(NumberIterator, [{
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

  return NumberIterator_1;

})));
