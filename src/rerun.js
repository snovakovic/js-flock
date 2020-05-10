const assertType = require('./internals/assertType')('rerun');

// >>> PUBLIC <<<

module.exports = function(fn) {
  assertType('Function', fn);

  let count = 0;
  let stop;
  let stopHandler;
  let timeout;
  let asLongAs;

  function run() {
    const shouldRun = !stop && (!asLongAs || asLongAs(count));
    if (shouldRun) {
      count += 1;
      const shouldContinue = fn() !== false;

      if (shouldContinue) {
        setTimeout(run, timeout);
        // Don't continue to stop handler as running is still in progress if we are her
        return;
      }
    }

    if (stopHandler) {
      stopHandler(count);
    }
  }

  return {
    every(timeoutInMs) {
      timeoutInMs = Number(timeoutInMs);
      assertType('Number', timeoutInMs);

      const isValid = timeoutInMs >= 0;

      if (!isValid) {
        throw Error('rerun: every() need to be called with positive number');
      }

      timeout = timeoutInMs;
      return this;
    },
    asLongAs(condition) {
      assertType('Function', condition);
      asLongAs = condition;
      return this;
    },
    start() {
      if (typeof timeout === 'undefined') {
        throw Error('rerun: every() is required before calling start()');
      }

      stop = false;
      run();
      return this;
    },
    stop() {
      stop = true;
      return this;
    },
    onStop(onStop) {
      assertType('Function', onStop);
      stopHandler = onStop;
      return this;
    },
  };
};
