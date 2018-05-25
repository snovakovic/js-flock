(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.rerun = global.rerun || {}, global.rerun.js = factory());
}(this, (function () { 'use strict';

// >>> PUBLIC <<<

var assertType$1 = function assertType(moduleName) {
  return function (type, val) {
    var tag = Object.prototype.toString.call(val);
    if ("[object " + type + "]" !== tag) {
      throw new TypeError(moduleName + ": expected [" + type + "] but got " + tag + "]");
    }
  };
};

var assertType = assertType$1('rerun');

// >>> PUBLIC <<<

var rerun = function rerun(fn) {
  assertType('Function', fn);

  var count = 0;
  var _stop = void 0;
  var stopHandler = void 0;
  var timeout = void 0;
  var _asLongAs = void 0;

  function run() {
    var shouldRun = !_stop && (!_asLongAs || _asLongAs(count));
    if (shouldRun) {
      count += 1;
      var shouldContinue = fn() !== false;

      if (shouldContinue) {
        setTimeout(run, timeout);
        // Don't continue to stop handler as runing is still in progress if we are her
        return;
      }
    }

    if (stopHandler) {
      stopHandler(count);
    }
  }

  return {
    every: function every(timoutInMs) {
      timoutInMs = Number(timoutInMs);
      assertType('Number', timoutInMs);

      var isValid = timoutInMs >= 0;

      if (!isValid) {
        throw Error('rerun: every() need to be called with positive number');
      }

      timeout = timoutInMs;
      return this;
    },
    asLongAs: function asLongAs(condition) {
      assertType('Function', condition);
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
      assertType('Function', _onStop);
      stopHandler = _onStop;
      return this;
    }
  };
};

return rerun;

})));
