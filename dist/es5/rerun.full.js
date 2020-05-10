(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.rerun = global.rerun || {}, global.rerun.js = factory()));
}(this, (function () { 'use strict';

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

  var assertType$1 = assertType('rerun'); // >>> PUBLIC <<<

  var rerun = function rerun(fn) {
    assertType$1('Function', fn);
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
        assertType$1('Number', timeoutInMs);
        var isValid = timeoutInMs >= 0;

        if (!isValid) {
          throw Error('rerun: every() need to be called with positive number');
        }

        timeout = timeoutInMs;
        return this;
      },
      asLongAs: function asLongAs(condition) {
        assertType$1('Function', condition);
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
        assertType$1('Function', _onStop);
        stopHandler = _onStop;
        return this;
      }
    };
  };

  return rerun;

})));
