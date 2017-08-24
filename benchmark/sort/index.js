/* eslint-disable no-console */

const Chalk = require('chalk');
const Table = require('cli-table2');
const log = require('single-line-log').stdout;

const getRandomInt = require('./getRandomInt');
const flatObject = require('./implementations/flatObject.js');
const deepObject = require('./implementations/deepObject.js');
const multiProperty = require('./implementations/multiProperty.js');
const flatArray = require('./implementations/flatArray.js');


const libraries = ['flock', 'latestFlock', 'native', 'lodash', 'arraySort', 'sortArray'];

const runConfiguration = [
  { size: 100, noRuns: 100 },
  { size: 1000, noRuns: 50 },
  { size: 10000, noRuns: 25 },
  { size: 100000, noRuns: 5 }
];

const headerItems = [Chalk.hex('f49b42')('Library')];
headerItems.push(...runConfiguration.map((c) => Chalk.hex('f49b42')(`${c.size} items`)));


function getRowValue(name, run) {
  if (!run[name]) {
    return Chalk.red('NOT SUPPORTED');
  }

  const flock = run.flockResults.average;
  const lib = run[name].average;
  let comparison = '';
  if (flock !== lib) {
    const color = flock < lib ? 'red' : 'green';
    const comparedToFlock = (Math.max(flock, lib) / Math.min(flock, lib)).toFixed(2);
    comparison = Chalk[color](`${flock < lib ? '↓' : '↑'} ${comparedToFlock}x `);
    comparison = `(${comparison})`;
  }

  return `${run[name].average.toFixed(4)}ms ${comparison}`;
}

function addRow(libName, result, table) {
  const value = getRowValue.bind(null, `${libName}Results`);

  if (libName === 'flock') libName = Chalk.blue(libName);
  if (libName === 'latestFlock') libName = Chalk.yellow(libName);

  table.push([libName, ...result.map((r) => value(r))]);
}


const run = function(implementation, randomizer) {
  const res = [];

  runConfiguration.forEach((conf, idx) => {
    res.push(implementation.run(Object.assign(conf, { randomizer })));
    log(`${idx + 1}/${runConfiguration.length}`);
    log.clear();
  });

  log('');

  const table = new Table({ head: headerItems });
  libraries.forEach((lib) => addRow(lib, res, table));

  console.log(table.toString());
};


console.info('\n --------------- SORT BENCHMARK ---------------');

console.log(`
  * Measurements are in milliseconds. Smaller is better(faster).
  * Native is native Array.prototype.sort used as a guideline.
  * Numbers in brackets are comparison to js-flock sort \n
`);


console.info('\n Benchmark 1: Flat object full random values \n');
run(flatObject);

console.info('\n Benchmark 2: Flat object repetitive values \n');
run(flatObject, () => getRandomInt(1, 5));

console.log('\n Benchmark 3: Flat array');
run(flatArray);

console.log('\n Benchmark 4: Deep nested object properties object full random values \n');
run(deepObject);

console.log('\n Benchmark 5: Multi property sort \n');
run(multiProperty);
