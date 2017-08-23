
const jsFlock = require('js-flock');
const latestFlockSort = require('../../../src/sort.js');
const sortArr = require('sort-arr');
const sortArray = require('sort-array');
const arraySort = require('array-sort');
const lodash = require('lodash');
const underscore = require('underscore');

const runner = require('./../runner');


// Define implementations

const flockImplementation = (arr) => jsFlock.sort(arr).asc((p) => p.amount);
const latestFlockImplementation = (arr) => latestFlockSort(arr).asc((p) => p.amount);
const lodashImplementation = (arr) => lodash.sortBy(arr, [(p) => p.amount]);
const underscoreImplementation = (arr) => underscore.sortBy(arr, (p) => p.amount);
const sortArrImplementation = (arr) => sortArr(arr, 'amount');
const sortArrayImplementation = (arr) => sortArray(arr, 'amount');
const arraySortImplementation = (arr) => arraySort(arr, 'amount');
const nativeImplementation = (arr) =>
  arr.sort((a, b) => {
    if (a.amount == null) return 1;
    if (b.amount == null) return -1;

    if (a.amount === b.amount) return 0;
    if (a.amount < b.amount) return -1;
    return 1;
  });


// Measure times

module.exports.run = function({ size, noRuns, randomizer = Math.random }) {
  const testArr = [];
  for (let i = 0; i < size; i++) {
    testArr.push({
      name: 'test',
      amount: randomizer()
    });
  }

  const controlArr = nativeImplementation(testArr.slice(0));
  const run = runner.bind(undefined, testArr, controlArr, noRuns);

  const jsFlockResults = run(flockImplementation);
  const latestFlockResults = run(latestFlockImplementation);
  const lodashResults = run(lodashImplementation);
  const underscoreResults = run(underscoreImplementation);
  const nativeResults = run(nativeImplementation);
  const sortArrayResults = run(sortArrayImplementation);
  const arraySortResults = run(arraySortImplementation);
  const sortArrResults = run(sortArrImplementation);

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
