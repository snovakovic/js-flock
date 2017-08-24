const jsFlock = require('js-flock');
const latestFlockSort = require('../../../src/sort.js');
const sortArray = require('sort-array');
const arraySort = require('array-sort');
const lodash = require('lodash');


const runner = require('./../runner');


// Define implementations

const flockImplementation = (arr) => jsFlock.sort(arr).asc((p) => p.level1.level2.amount);
const latestFlockImplementation = (arr) => latestFlockSort(arr).asc((p) => p.level1.level2.amount);
const lodashImplementation = (arr) => lodash.sortBy(arr, [(p) => p.level1.level2.amount]);
const sortArrayImplementation = (arr) => sortArray(arr, 'level1.level2.amount');
const arraySortImplementation = (arr) => arraySort(arr, 'level1.level2.amount');
const nativeImplementation = (arr) =>
  arr.sort((a, b) => {
    if (a.level1.level2.amount == null) return 1;
    if (b.level1.level2.amount == null) return -1;

    if (a.level1.level2.amount === b.level1.level2.amount) return 0;
    if (a.level1.level2.amount < b.level1.level2.amount) return -1;
    return 1;
  });


// Measure times

module.exports.run = function({
  size,
  noRuns,
  randomizer = Math.random
}) {
  const testArr = [];
  for (let i = 0; i < size; i++) {
    testArr.push({
      name: 'test',
      level1: {
        level2: {
          amount: randomizer()
        }
      }
    });
  }

  const controlArr = nativeImplementation(testArr.slice(0));
  const run = runner.bind(undefined, testArr, controlArr, noRuns);

  const jsFlockResults = run(flockImplementation);
  const latestFlockResults = run(latestFlockImplementation);
  const lodashResults = run(lodashImplementation);
  const nativeResults = run(nativeImplementation);
  const sortArrayResults = run(sortArrayImplementation);
  const arraySortResults = run(arraySortImplementation);

  // NOT SUPPORTED
  const sortArrResults = undefined; // run(sortArrImplementation);

  return {
    jsFlockResults,
    latestFlockResults,
    lodashResults,
    nativeResults,
    sortArrResults,
    sortArrayResults,
    arraySortResults
  };
};
