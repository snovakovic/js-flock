/* eslint-disable no-console */

const Chalk = require('chalk');
const Table = require('cli-table2');

const getRandomInt = require('./getRandomInt');
const flatObject = require('./implementations/flatObject.js');
const deepObject = require('./implementations/deepObject.js');
const multiProperty = require('./implementations/multiProperty.js');
const flatArray = require('./implementations/flatArray.js');


const libraries = [
  'jsFlock',
  'latestFlock',
  'native',
  'lodash',
  'underscore',
  'arraySort',
  'sortArr',
  'sortArray'
];

const headerItems = [
  'Library',
  '10 items',
  '100 items',
  '1000 items',
  '10 000 items',
  '100 000 items'
];

function getRowValue(name, run) {
  if (!run[name]) {
    return Chalk.red('NOT SUPPORTED');
  }

  const flock = run.jsFlockResults.average;
  const lib = run[name].average;
  let comparison = '';
  if (flock !== lib) {
    const color = flock < lib ? 'red' : 'green';
    const comparedToFlock = (Math.max(flock, lib) / Math.min(flock, lib)).toFixed(2);
    comparison = Chalk[color](`${flock < lib ? '↓' : '↑' } ${comparedToFlock}x `);
    comparison = `(${comparison})`;
  }

  const result = `${run[name].average.toFixed(4)}ms ${comparison}`;
  return name === 'jsFlockResults' ? Chalk.blue(result) : result;
}

function addRow(libName, result, table) {
  const value = getRowValue.bind(null, `${libName}Results`);
  if (libName === 'jsFlock') libName = Chalk.blue(libName);
  if (libName === 'latestFlock') libName = Chalk.green(libName);

  table.push([
    libName === 'jsFlock' ? Chalk.blue(libName) : libName,
    ...result.map((r) => value(r))
  ]);
}


const run = function(implementation, randomizer) {
  const res = [];
  res.push(implementation.run({
    size: 10,
    noRuns: 50,
    randomizer
  }));
  console.log('1/5');
  res.push(implementation.run({
    size: 100,
    noRuns: 50,
    randomizer
  }));
  console.log('2/5');
  res.push(implementation.run({
    size: 1000,
    noRuns: 15,
    randomizer
  }));
  console.log('3/5');
  res.push(implementation.run({
    size: 10000,
    noRuns: 5,
    randomizer
  }));
  console.log('4/5');
  res.push(implementation.run({
    size: 100000,
    noRuns: 1,
    randomizer
  }));
  console.log('5/5');

  const table = new Table({
    head: headerItems
  });
  libraries.forEach((lib) => addRow(lib, res, table));

  console.log(table.toString());
};


console.info('---SORT BENCHMARK---');

console.log(`\n
  * Measurements are in milliseconds. Smaller is better(faster).  \n
  * Native is native Array.prototype.sort used as a guideline. \n
  * Numbers in brackets are comparison to js-flock sort \n`);


console.info('\n Benchmark 1: Flat object full random values');
run(flatObject);

console.info('\n Benchmark 2: Flat object repetitive values');
run(flatObject, () => getRandomInt(1, 5));

console.log('\n Benchmark 3: Flat array');
run(flatArray);

console.log('\n Benchmark 4: Deep nested object properties object full random values');
run(deepObject);

console.log('\n Benchmark 5: Multi property sort');
run(multiProperty);
