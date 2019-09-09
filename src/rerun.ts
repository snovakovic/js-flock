import assertTypeFactory from './internals/assertType';

const assertType = assertTypeFactory('rerun');

interface IStopHandler {
  (numberOfCalls:number):void
}

interface IAsLongAsHandler {
  (numberOfCalls:number):boolean
}

// >>> PUBLIC <<<

export default function(fn:Function) {
  assertType('Function', fn);

  let numberOfCalls = 0;
  let stop:boolean;
  let timeout:number;
  let stopHandler:IStopHandler;
  let asLongAs:IAsLongAsHandler;

  function run() {
    const shouldRun = !stop && (!asLongAs || asLongAs(numberOfCalls));
    if (shouldRun) {
      numberOfCalls += 1;
      const shouldContinue = fn() !== false;

      if (shouldContinue) {
        setTimeout(run, timeout);
        // Don't continue to stop handler as running is still in progress if we are her
        return;
      }
    }

    if (stopHandler) {
      stopHandler(numberOfCalls);
    }
  }

  return {
    every(timeoutInMs:number) {
      timeoutInMs = Number(timeoutInMs);
      assertType('Number', timeoutInMs);

      const isValid = timeoutInMs >= 0;

      if (!isValid) {
        throw Error('rerun: every() need to be called with positive number');
      }

      timeout = timeoutInMs;
      return this;
    },
    asLongAs(condition:IAsLongAsHandler) {
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
    onStop(onStop:IStopHandler) {
      assertType('Function', onStop);
      stopHandler = onStop;
      return this;
    }
  };
};
