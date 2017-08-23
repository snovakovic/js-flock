
const jsFlock = require('js-flock');
const latestFlockSort = require('../../../src/sort.js');
const arraySort = require('array-sort');
const getRandomInt = require('../getRandomInt');
const lodash = require('lodash');

const runner = require('./../runner');


// Define implementations

const flockImplementation = (arr) => jsFlock.sort(arr).asc([
  (p) => p.am1,
  (p) => p.am2
]);
const latestFlockImplementation = (arr) => latestFlockSort(arr).asc([
  (p) => p.am1,
  (p) => p.am2
]);
const lodashImplementation = (arr) => lodash.sortBy(arr, [
  (p) => p.am1,
  (p) => p.am2
]);
const arraySortImplementation = (arr) => arraySort(arr, 'am1', 'am2');


// Measure times

module.exports.run = function({ size, noRuns }) {
  const testArr = [];
  for (let i = 0; i < size; i++) {
    testArr.push({
      name: 'test',
      am1: getRandomInt(1, 50),
      am2: Math.random()
    });
  }

  const controlArr = flockImplementation(testArr.slice(0));
  const run = runner.bind(undefined, testArr, controlArr, noRuns);

  const jsFlockResults = run(flockImplementation);
  const latestFlockResults = run(latestFlockImplementation);
  const lodashResults = run(lodashImplementation);
  const underscoreResults = undefined;
  const nativeResults = undefined;
  const sortArrayResults = undefined;
  const arraySortResults = run(arraySortImplementation);
  const sortArrResults = undefined;

  return {
    jsFlockResults,
    latestFlockResults,
    lodashResults,
    underscoreResults,
    nativeResults,
    sortArrResults,
    sortArrayResults,
    arraySortResults
  };
};
