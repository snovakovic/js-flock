(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.Ensurer = global.Ensurer || {}, global.Ensurer.js = factory()));
}(this, (function () { 'use strict';

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

  return Ensurer_1;

})));
