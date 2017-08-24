
const jsFlock = require('js-flock');
const latestFlockSort = require('../../../src/sort.js');
const arraySort = require('array-sort');
const getRandomInt = require('../getRandomInt');
const lodash = require('lodash');

const base = require('./base');


const implementations = {
  flock: (arr) => jsFlock.sort(arr).asc([
    (p) => p.am1,
    (p) => p.am2
  ]),
  latestFlock: (arr) => latestFlockSort(arr).asc([
    (p) => p.am1,
    (p) => p.am2
  ]),
  lodash: (arr) => lodash.sortBy(arr, [
    (p) => p.am1,
    (p) => p.am2
  ]),
  arraySort: (arr) => arraySort(arr, 'am1', 'am2')
};

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

  const controlArr = implementations.flock(testArr.slice(0));
  return base.run(implementations, testArr, controlArr, noRuns);
};
