const jsFlock = require('js-flock');
const latestFlockSort = require('../../../src/sort.js');
const sortArray = require('sort-array');
const arraySort = require('array-sort');
const lodash = require('lodash');

const base = require('./base');


const implementations = {
  flock: (arr) => jsFlock.sort(arr).asc((p) => p.level1.level2.amount),
  latestFlock: (arr) => latestFlockSort(arr).asc((p) => p.level1.level2.amount),
  lodash: (arr) => lodash.sortBy(arr, [(p) => p.level1.level2.amount]),
  sortArray: (arr) => sortArray(arr, 'level1.level2.amount'),
  arraySort: (arr) => arraySort(arr, 'level1.level2.amount'),
  native: (arr) =>
    arr.sort((a, b) => {
      if (a.level1.level2.amount == null) return 1;
      if (b.level1.level2.amount == null) return -1;

      if (a.level1.level2.amount === b.level1.level2.amount) return 0;
      if (a.level1.level2.amount < b.level1.level2.amount) return -1;
      return 1;
    })
};

// Measure times

module.exports.run = function({ size, noRuns, randomizer = Math.random }) {
  const testArr = [];
  for (let i = 0; i < size; i++) {
    testArr.push({
      name: 'test',
      level1: {
        level2: { amount: randomizer() }
      }
    });
  }

  const controlArr = implementations.flock(testArr.slice(0));
  return base.run(implementations, testArr, controlArr, noRuns);
};
