const runner = require('./../runner');

// Measure times

module.exports.run = function(impl, testArr, controlArr, noRuns) {
  const run = runner.bind(undefined, testArr, controlArr, noRuns);

  return {
    flockResults: impl.flock ? run(impl.flock) : undefined,
    latestFlockResults: impl.latestFlock ? run(impl.latestFlock) : undefined,
    lodashResults: impl.lodash ? run(impl.lodash) : undefined,
    sortArrayResults: impl.sortArray ? run(impl.sortArray) : undefined,
    arraySortResults: impl.arraySort ? run(impl.arraySort) : undefined,
    nativeResults: impl.native ? run(impl.native) : undefined
  };
};
