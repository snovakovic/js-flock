# js-flock

[![Build Status](https://travis-ci.org/snovakovic/js-flock.svg?branch=master)](https://travis-ci.org/snovakovic/js-flock)
[![Git Stars](http://githubbadges.com/star.svg?user=snovakovic&repo=js-flock)](http://github.com/snovakovic/js-flock/stargazers)
[![Code Quality](https://api.codacy.com/project/badge/grade/fe5f8741eaed4c628bca3761c32c3b68)](https://www.codacy.com/app/snovakovic/js-flock/dashboard?bid=4653162)
[![Code Coverage](https://api.codacy.com/project/badge/Coverage/f0ea30fd63bd4bc88ea3b0965094ced1)](https://www.codacy.com/app/snovakovic/js-flock?utm_source=github.com&utm_medium=referral&utm_content=snovakovic/js-flock&utm_campaign=Badge_Coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/snovakovic/js-flock/badge.svg)](https://snyk.io/test/github/snovakovic/js-flock)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![NPM Package](https://nodei.co/npm/js-flock.png)](https://www.npmjs.com/package/js-flock)


Collection of neat modular utilities for bumping up development in NODE and Browser.

## Including library

Library is modular so you can include only modules that you need/use (recommended way of using library). **By default unmodified ES6 code is loaded**, optionally you can include transpiled ES5 code (recommended for browser environment).
Transpiled code is wrapped in [UMD](https://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) and can be loaded in Browser as CommonJs, AMD or as global var.

```javascript
  // Load unmodified ES6 sort module (recommended for node environment).
  // In same way we can include any other library module e.g ('js-flock/toEnum', 'js-flock/deepFreeze'...)
  const sort = require('js-flock/sort');

  // Load transpiled/minified ES5 sort module (recommended for browser).
  const sort = require('js-flock/es5/sort');

  // Load whole unmodified ES6 library
  const jsFlock = require('js-flock');

  // Load whole transpiled/minified ES5 library
  // Note recommended in browser as bundle can be larger than we need
  const jsFlock = require('js-flock/es5');
```

## Methods:
* [last](#last)
* [empty](#empty)
* [single](#single)
* [sort](#sort)
* [numberIterator](#numberiterator)
* [castBoolean](#castboolean)
* [toEnum](#toenum)
* [singular](#singular)
* [waitFor](#waitfor)
* [rerun](#rerun)
* [delay](#delay)
* [promiseAll](#promiseall)
* [promisify](#promisify)
* [promisify.all](#promisifyall)
* [collar](#collar)
* [deepFreeze](#deepfreeze) / [deepSeal](#deepseal) / [deepPreventExtensions](#deeppreventextensions)

### last

Get the last element of an array. If condition is provided get the last element of an array that meets provided condition or undefined.

##### since: v2.2.0

```javascript
const last = require('js-flock/last');

last([1, 4, 2]); // => 2

const persons = [{ id: 1, name: 'john'}, { id: 2, name: 'john'}, { id: 3, name: 'doe'}]

last(persons) // =>  { id: 3, name: 'doe'}
last(persons, (p) => p.name === 'john') // => { id: 2, name: 'john'}
last(persons, (p) => p.name === 'no-name') // => undefined
```


### empty

Remove all items from 1 or more provided arrays.

##### since: v3.2.0

```javascript
const empty = require('js-flock/empty');

const arr = [1, 2, 3];

// Shorthand for applying arr.splice(0, arr.length);
const emptyArr = empty(arr); // => arr ==== []
console.log(emptyArr === arr) // => true

// We can empty multiple arrays. Non array values will be ignored
empty(arr1, undefined, arr2, 3);
```

### single

Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.

##### since: v3.13.0

```javascript
const single = require('js-flock/single');

// Without providing any condition
single([1]); // => 1
single([1, 2]); // => TypeError('More than one element satisfies the condition')
single([]); // => TypeError('No element satisfies the condition')

// With condition
const users = [
  { email: 'john@doe.com', fullName: 'John Doe 1' },
  { email: 'john@doe.com', fullName: 'John Doe 2' }, // NOTE same email as John Doe 1
  { email: 'mark@johnson.com', fullName: 'Mark Johnson' },
];

single(users, user => user.email === 'mark@johnson.com'); // { email: 'mark@johnson.com', fullName: 'Mark Johnson' }
single(users, user => user.email === 'john@doe.com'); // TypeError('More than one element satisfies the condition')
single(users, user => user.email === 'no@user.com'); // TypeError('No element satisfies the condition')
```

### NumberIterator

get next number in sequence.

##### since: v3.9.0

````javascript
const NumberIterator = require('js-flock/NumberIterator');

const numberIterator = new NumberIterator();
numberIterator.current() // => 0
numberIterator.next() // => 1
numberIterator.next() // => 2
numberIterator.current() // => 2

// When instantiating iterator we can pass optional startFrom property
const numberIterator2 = new NumberIterator({ startFrom: 10 });
numberIterator2.current() // => 10
numberIterator2.next() // => 11
````

If iterator reaches `Number.MAX_SAFE_INTEGER` the iterator exhausted error will be thrown on next iteration call.

### castBoolean

Cast any value to boolean value. castBoolean will return true for true or "true" values
while any other value will be evaluated to false.

##### since: v3.11.0

````javascript
const castBoolean = require('js-flock/castBoolean');

castBoolean(true); // => true
castBoolean('true'); // => true

castBoolean(undefined) // => false
castBoolean('foo') // => false
````
### toEnum

Convert object or list of strings to enum representation.
Enum representation is immutable (frozen)

```javascript
const toEnum = require('js-flock/toEnum');

const vehicleType = toEnum({
  CAR: 'C',
  TRUCK: 'T',
  AIRPLANE: 'A',
  HELICOPTER: 'H',
  canFly(type) { // Define custom helper
    return type === this.AIRPLANE || type === this.HELICOPTER;
  }
});

const vehicle = getVehicle();

if (vehicle.type === vehicleType.TRUCK) {
  // Special behaviour only for truck vehicles
}

if (vehicleType.canFly(vehicle.type)) {
  // Special behaviour for vehicles that can fly
}

// enum is immutable
vehicleType.TRUCK = 'boat'; // vehicleType.TRUCK === 'T'

// Each enum have standard helpers

vehicleType.keys(); // ['CAR', 'TRUCK', 'AIRPLANE', 'HELICOPTER'] - helper functions are not included in keys
vehicleType.values(); // ['C', 'T', 'A', 'H']

vehicleType.exists('C'); // true
vehicleType.exists('something'); // false

vehicleType.haveKey('CAR'); // true
vehicleType.haveKey('something'); // false


// We can define enum with short notation. Limitation of short notation is that we can't define custom enum helpers.

const gender = toEnum(['MAN', 'WOMEN', 'OTHER']);

gender.keys(); // ['MAN', 'WOMEN', 'OTHER']
gender.values(); // [Symbol(MAN), Symbol(Women), Symbol(OTHER)]
```


### singular

 Creates singular function that after is called can't be called again until it finishes with execution.
 Singular function injects done function as a first argument of the original function.
 When called done indicates that function has finished with execution and that it can be called again.

 For example we will use Vue.js and click handler.

```html
<span @click="save()" role="button">Save User</span>
```

```javascript
const singular = require('js-flock/singular');

export default {
  methods: {
    save: singular(function(done) {
      // All subsequent calls to submit will be ignored until done is called
      UserService.save(this.user)
        .then(() => { /* Success handler */ })
        .catch(() => { /* Exception handler */ })
        .then(done);
    }
  };
}
```

### waitFor

Wait for task to complete before executing function. This module is useful when there isn't event
you can hook into to signify that a given task is complete. waitFor returns promise that resolves
after check function returns truthy value.

##### since: v2.4.0

```javascript
const waitFor = require('js-flock/waitFor');

const options = {
  interval: Number, // [Default: 50ms] - How frequently will check be preformed.
  timeout: Number, // [Default: 5000ms] - Timeout if function is not resolved by then.
};

// Wait for DB connection
waitFor(() => Db.connection, options)
  .then((connection) => { /* connection to DB has been established */})
  .catch(() => { /* Waiting timed out, handle the error! */ });

// Wait for DOM element to become accessible
waitFor(() => document.getElementById('elId'))
  .then(($el) => { /* Element is available now we can do manipulation with $el */})
  .catch(() => { /* Waiting timed out, handle the error! */ });

// We can abort execution of waitFor at any moment by calling abort function that is
// injected to waitFor listener as shown in example.
// NOTE: Available from v3.6.0
waitFor((abort) => {
  if(componentIsDestroyed) {
    // waitFor will immediately stop checking for presence of element
    // than/catch will never be called after calling abort
    abort();
  } else {
    return document.getElementById('elId');
  }
})
  .then(($el) => { /* Element is available now we can do manipulation with $el */})
  .catch(() => { /* Waiting timed out, handle the error! */ });
```

### rerun

setInterval on steroids.

##### since: v3.3.0

```javascript

  // Any user defined function.
  rerun(Function)
    // How frequently will rerun function be called
    .every(timeInMilliseconds)
    // [Optional] Execution is stopped if falsy value is returned from function. If falsy value is returned first time rerun will never be called.
    .asLongAs(Function)
    // Execute rerun function for first time and start execution cycle
    .start()
    // [Optional] -> Attach onStop listener
    .onStop(Function)
    // [Optional] Stop function execution. Function execution can also be stoped by returning falsy value from asLongAs or by returning `false` value from within rerun function
    .stop()

  // Example
  // refreshAuthToken and isUserLoggedIn are custom function implementations
  const tenMinutesInMs = 10 * 60 * 1000;
  const refreshTokenRunner = rerun(refreshAuthToken)
    .every(tenMinutesInMs)
    .asLongAs(isUserLoggedIn);

  // Function that will be called after user log in
  // Every call to start will execute function immediately and restart execution cycle
  eventBus.$on('login', refreshTokenRunner.start);
```

## delay

Delay a promise a specified amount of time. Think of it as setTimeout for async flow

##### since: v3.8.0


```javascript
const delay = require('js-flock/delay');

async exampleFunction() {
  bar();

  // Wait for 100 milliseconds
  // If delay time not provided it defaults ot 0ms (next tick)
  await delay(100);

  // Executed 100 milliseconds later
  baz();
}
```

### promiseAll

Alias for `Promise.all` that works on objects and arrays

##### since: v3.7.0

```javascript
const promiseAll = require('js-flock/promiseAll');

const objectResponse = await promiseAll({
  users: db.fetchUsers(),
  schools: db.fetchSchools(),
});

/*
  objectResponse =>
    {
      users: [{...}, {...}], // value of fetchUsers promise resolve
      schools: [{...}, {...}], // value of fetchSchools promise resolve
    }
*/

const arrayResponse = await promiseAll([db.fetchUsers(), db.fetchSchools()]);

/*
  arrayResponse => [usersResponse, schoolsResponse]
*/

```

### promisify

Promisify error first callback function. Instead of taking a callback, the returned function
will return a promise whose fate is decided by the callback behavior of the given node function.
Promisify returns native Promise (requires Promise polyfill on older browser)

```javascript
const promisify = require('js-flock/promisify');
const readFile = require("fs").readFile;
const readFileAsync = promisify(readFile);

// Native version of read file
readFile('test.txt', 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});

// Promisify version
readFileAsync('test.txt', 'utf8')
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
```

If callback function is called with multiple success values, the fulfillment value will be the
first fulfillment item.

Setting multiArgs options to true means the resulting promise will always fulfill with
an array of the callback's success value(s). This is needed because promises only support a
single success value while some callback API's have multiple success value.

```javascript
const fun = (cb) => cb(undefined, 'res1', 'res2');
const funAsync = promisify(fun, { multiArgs: true });

funAsync().then(([r1, r2]) => { /* r1 === res1, r2 === res2 */ });
```


### promisify.all

Promisify the entire object by going through the object's properties and creating
an async equivalent of each function on the object.
Promisify.all mutates input object by adding promisified versions to object.
It will never overwrite existing properties of object.

By default promisify.all does not loop over object prototype which can be change by providing
{ proto: true } option.

The promisified method name will be the original method name suffixed with suffix (default = 'Async').

```javascript
const promisify = require('js-flock/promisify');
const fs = promisify.all(require("fs"));

// New function appended by promisify.all
fs.readFileAsync('test.txt', 'utf8')
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

const withOptions = promisify.all(test, {
  suffix: String, // [default: 'Async'] - Suffix will be appended to original method name
  multiArgs: Boolean, // [default: false] Promise will resolve with array of values if true
  proto: Boolean, // [default: false] Promisify object prototype chain if true
  exclude: [String], // [default: undefined] List of object keys not to promisify
  include: [String], // [default: undefined] Promisify only provided keys
});
```


### collar

Set maximum waiting time for promise to resolve. Reject promise if it's not resolved in that time

```javascript
const collar = require('js-flock/collar');

const MAX_WAITING_TIME = 500;

// Reject HTTP request if it's not resolved in 0.5 seconds
collar(Http.get('test-url'), MAX_WAITING_TIME)
.then((response) => { /* handle response */  })
.catch((err) => {
  // CollarError = { isStrangled: true, message: 'Promise have timed out' }
  if (typeof err === 'object' && err.isStrangled) {
    console.log(err.message);
  }
});
```


### deepFreeze

Recursively apply [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

```javascript
const deepFreeze = require('js-flock/deepFreeze');

const person = {
  fullName: 'test person',
  dob: new Date(),
  address: {
    country: 'testiland',
    city: 'this one'
  }
};

Object.freeze(person);

Object.isFrozen(person); // true
Object.isFrozen(person.address); // false UH OH

deepFreeze(person);

Object.isFrozen(person); // true
Object.isFrozen(person.address); // true WE HE

// We can modify deepFreeze behaviour by providing additional options

deepFreeze(object, {
  proto: Boolean, // [default: false] - Freeze object prototype chain
  exclude: Function, // Fine tune what will be frozen by providing exclude function. Available from version [3.3.2]
});

deepFreeze(person, {
  // address object will not be frozen
  exclude(key, context) {
    return key === 'address' && context === person;
  }
});
```


### deepSeal

Recursively apply [Object.seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal).
For example of usage reference [deepFreeze](#deepfreeze)


### deepPreventExtensions

Recursively apply [Object.preventExtensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions).
For example of usage reference [deepFreeze](#deepfreeze)


### sort

Source code of sort has been moved to dedicated package https://www.npmjs.com/package/fast-sort and is now just imported here.
For more info on sort please check dedicated package from above.

```javascript
  const sort = require('js-flock/sort');

  sort([1, 4, 2]).asc(); // => [1, 2, 4]
  sort([1, 4, 2]).desc(); // => [4, 2, 1]

  sort(persons).asc(p => p.firstName);

  // Sort persons by multiple properties
  sort(persons).desc([
    p => p.firstName
    p => p.address.city
  ]);

  // Sort in multiple directions
  sort(persons).by([
    { asc: 'name' }
    { desc: 'age' }
    { asc: p => p.address.city }
  ]);
```
