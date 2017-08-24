const runner = require('./../runner');

// Measure times

module.exports.run = function(impl, testArr, controlArr, noRuns, flockOnly) {
  const run = runner.bind(undefined, testArr, controlArr, noRuns);

  const output = {
    flockResults: impl.flock ? run(impl.flock) : undefined
  };

  if (flockOnly) {
    return Object.assign(output, {
      latestFlockResults: impl.latestFlock ? run(impl.latestFlock) : undefined
    });
  }

  return Object.assign(output, {
    lodashResults: impl.lodash ? run(impl.lodash) : undefined,
    sortArrayResults: impl.sortArray ? run(impl.sortArray) : undefined,
    arraySortResults: impl.arraySort ? run(impl.arraySort) : undefined,
    nativeResults: impl.native ? run(impl.native) : undefined
  });
};
