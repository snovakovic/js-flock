
const jsFlock = require('js-flock');
const latestFlockSort = require('../../../src/sort.js');
const sortArray = require('sort-array');
const arraySort = require('array-sort');
const lodash = require('lodash');

const base = require('./base');


const implementations = {
  flock: (arr) => jsFlock.sort(arr).asc((p) => p.amount),
  latestFlock: (arr) => latestFlockSort(arr).asc((p) => p.amount),
  lodash: (arr) => lodash.sortBy(arr, [(p) => p.amount]),
  sortArray: (arr) => sortArray(arr, 'amount'),
  arraySort: (arr) => arraySort(arr, 'amount'),
  native: (arr) =>
    arr.sort((a, b) => {
      if (a.amount == null) return 1;
      if (b.amount == null) return -1;

      if (a.amount === b.amount) return 0;
      if (a.amount < b.amount) return -1;
      return 1;
    })
};

// Measure times

module.exports.run = function({ size, noRuns, flockOnly, randomizer = Math.random }) {
  const testArr = [];
  for (let i = 0; i < size; i++) {
    testArr.push({
      name: 'test',
      amount: randomizer()
    });
  }

  const controlArr = implementations.flock(testArr.slice(0));
  return base.run(implementations, testArr, controlArr, noRuns, flockOnly);
};
