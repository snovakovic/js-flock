
const jsFlock = require('js-flock');
const latestFlockSort = require('../../../src/sort.js');
const arraySort = require('array-sort');
const lodash = require('lodash');

const runner = require('./../runner');


// Define implementations

const flockImplementation = (arr) => jsFlock.sort(arr).asc();
const latestFlockImplementation = (arr) => latestFlockSort(arr).asc();
const lodashImplementation = (arr) => lodash.sortBy(arr);
const arraySortImplementation = (arr) => arraySort(arr);
const nativeImplementation = (arr) =>
  arr.sort((a, b) => {
    if (a == null) return 1;
    if (b == null) return -1;

    if (a === b) return 0;
    if (a < b) return -1;
    return 1;
  });


// Measure times

module.exports.run = function({ size, noRuns, randomizer = Math.random }) {
  const testArr = [];
  for (let i = 0; i < size; i++) {
    testArr.push(randomizer());
  }

  const controlArr = nativeImplementation(testArr.slice(0));
  const run = runner.bind(undefined, testArr, controlArr, noRuns);

  const jsFlockResults = run(flockImplementation);
  const latestFlockResults = run(latestFlockImplementation);
  const lodashResults = run(lodashImplementation);
  const nativeResults = run(nativeImplementation);
  const arraySortResults = run(arraySortImplementation);
  const sortArrayResults = undefined;

  return {
    jsFlockResults,
    latestFlockResults,
    lodashResults,
    nativeResults,
    sortArrayResults,
    arraySortResults
  };
};
