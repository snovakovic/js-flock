# js-flock

[![Build Status](https://travis-ci.org/snovakovic/js-flock.svg?branch=master)](https://travis-ci.org/snovakovic/js-flock)
[![Code quality](https://api.codacy.com/project/badge/grade/fe5f8741eaed4c628bca3761c32c3b68)](https://www.codacy.com/app/snovakovic/js-flock/dashboard?bid=4653162)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

npm install js-flock --save

JS utility methods for NODE and Browser. Requires ES6 environment as minimum to run the code.

### Methods:

- [promisify](#promisify)
- [collar](#collar)
- [toEnum](#toenum)
- [sort](#sort)
- [deepFreeze](#deepfreeze)
- [deepSeal](#deepseal)

### promisify

Promisify error first callback function

```javascript
  const promisify = require('js-flock').promisify;
  const readFile = require("fs").readFile;

  const readFileAsync = promisify(readFile); // Promise version of read file

  // Native version of read file
  readFile('test.txt', 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });

  // Promisify version
  readFileAsync('test.txt', 'utf8')
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
```

### collar

Set maximum waiting time for promise to resolve.
Reject promise if it's not resolved in that time

```javascript
  const collar = require('js-flock').collar;

  const MAX_WAIT_TIME = 500;

  collar(Promise.all([
    new Promise((resolve) => setTimeout(resolve, 50, '1')),
    new Promise((resolve) => setTimeout(resolve, 100, '2'))
  ]), MAX_WAIT_TIME)
  .then(([first, second]) => {
    console.log('this is called as promises are resolved before timeout')
  }).catch((err) => console.log('this is not called'));

  collar(
    new Promise((resolve) => setTimeout(resolve, 1000, '1')),
    MAX_WAIT_TIME
  ).then((data) => {
    // This is not called
  }).catch((err) => {
    if(typeof err = 'object' && err.isStrangled) {
      // collar have rejected promise because it have timed out
      console.log(err); // err = { isStrangled: true, message: 'Promises have timed out' }
    }
  });

  collar(Http.get('test-url'), MAX_WAIT_TIME)
    .then((response) => console.log(response))
    .catch((err) => console.log('promise have timed out'));
```

### toEnum

Convert object or list of strings to enum representation.
Enum representation is immutable (frozen)

```javascript
  const toEnum = require('js-flock').toEnum;

  const vehicleType = toEnum({
    TRUCK: 'TRUCK',
    CAR: 'CAR',
    MOTORBIKE: 'MOTORBIKE',
    CAMPER: 'CAMPER'
  });

  // We can also use short notation to define above enum when keys are equal to values.
  // Both enum representations are equal

  const vehicleType = toEnum(['TRUCK', 'CAR', 'MOTORBIKE', 'CAMPER']);

  if(vehicle.type === vehicleType.TRUCK) {
    // Special behaviour only for truck vehicles
  }

  vehicleType.TRUCK = 'boat';
  vehicleType.BOAT = 'BOAT';

  console.log(vehicleType.TRUCK); // TRUCK - enum is immutable
  console.log(vehicleType.BOAT); // undefined - enum is immutable

  // Following enum can't be written in short notation as keys are different then values

  const gender = toEnum({
    MAN: 'M',
    WOMEN: 'W',
    OTHER: 'O'
  });

  // Enum helpers

  gender.keys(); // return array of keys ['MAN', 'WOMEN', 'OTHER']
  gender.values(); // return array of values ['M', 'W', 'O']

  gender.exists('W'); // true
  gender.exists('T'); // false

  gender.haveKey('MAN'); // true
  gender.haveKey('CAR'); // false
```

### sort

Small wrapper around sort to make sorting more readable and easier to write.
Undefined and null values are always sorted to bottom of list no matter if ordering is ascending or descending.


```javascript
  const sort = require('js-flock').sort;

  sort([1,4,2]).asc(); // sort array in ascending order [1, 2, 4]
  sort([1,4,2]).desc(); // sort array in descending order [4, 2, 1]

  // Sort persons (array of objects) ascending by lowercase names
  sort(persons).asc((p) => p.name.toLowerCase());

  // There is no exception if we try to sort values that are not sortable
  // If input is not array same value is returned back
  sort(null).asc(); // return null
  sort(33).desc(); // return 33
```

```javascript
  sort(persons).asc((p) => p.name.toLowerCase());

  // Above statement is equivalent to

  persons.sort((a, b) => {
    // == null are true for undefined and null.
    // We need to check that first in order to move undefined/null values to bottom of list
    if (a.name == null) return 1;
    if (b.name == null) return -1;

    // Cast to lowercase if there is value
    const aName = aName.toLowerCase();
    const bName = bName.toLowerCase();

    if (aName === bName) return 0;
    if (aName < bName) return -1; // Is this asc or desc sorting?? let's check documentation
    return 1;
  });
```

### deepFreeze

Recursively apply [Object.freez](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

```javascript
  const deepFreeze = require('js-flock').deepFreeze;

  const person = {
    fullName: 'test person',
    dob: new Date(),
    address: {
      country: 'testiland',
      city: 'this one'
    }
  }

  Object.freeze(person);

  Object.isFrozen(person); // true
  Object.isFrozen(person.address); // false UH OH

  deepFreeze(person);

  Object.isFrozen(person); // true
  Object.isFrozen(person.address); // true WE HE
```

### deepSeal

Recursively apply [Object.seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal).
For example check [deepFreeze](#deepfreeze)
