import assertTypeFactory from './internals/assertType';
const assertType = assertTypeFactory('waitFor');

interface IWaitForOptions {
  interval?:number,
  timeout?:number,
}

// >>> PUBLIC <<<

module.exports = function<T>(
  waitForChecker:(abort:() => void) => T,
  options:IWaitForOptions = {},
):Promise<T> {
  assertType('Function', waitForChecker);

  const interval = Number(options.interval) || 50;
  const endTime = Date.now() + (Number(options.timeout) || 5000);

  return new Promise((resolve, reject) => {
    let isAborted = false;
    const abort = () => isAborted = true;

    (function check() {
      const result = waitForChecker(abort);

      if (isAborted) return;
      if (result) return resolve(result);
      if (Date.now() > endTime) return reject(new Error('Timed out!'));

      setTimeout(check, interval);
    }());
  });
};
