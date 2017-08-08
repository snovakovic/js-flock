# js-flock

[![Build Status](https://travis-ci.org/snovakovic/js-flock.svg?branch=master)](https://travis-ci.org/snovakovic/js-flock)
[![Code quality](https://api.codacy.com/project/badge/grade/fe5f8741eaed4c628bca3761c32c3b68)](https://www.codacy.com/app/snovakovic/js-flock/dashboard?bid=4653162)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/f0ea30fd63bd4bc88ea3b0965094ced1)](https://www.codacy.com/app/snovakovic/js-flock?utm_source=github.com&utm_medium=referral&utm_content=snovakovic/js-flock&utm_campaign=Badge_Coverage)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![NPM Package](https://nodei.co/npm/js-flock.png)](https://www.npmjs.com/package/js-flock)


JS utility methods for NODE and Browser.

### Including library

We can include whole library at once or a module by module. By default unmodified ES6 code is loaded,
optionally we can load transpiled ES5 code. Transpiled code is wrapped in UMD
and can be loaded in browser as CommonJs, AMD or as global var.

```javascript
  // Loads whole unmodified ES6 library
  import jsFlock from 'js-flock';

  // We can also use node require statement to do same thing
  const jsFlock = require('js-flock');

  // Loads single toEnum module. Ideal for usage in browser
  import toEnum from 'js-flock/toEnum';

  // Loads transpiled ES5 version of library
  import jsFlock from 'js-flock/es5';

  // Loads single transpiled module
  import singular from 'js-flock/es5/singular';
```


### Methods:

- [toEnum](#toenum)
- [sort](#sort)
- [singular](#singular)
- [promisify](#promisify)
- [promisify.all](#promisify.all)
- [collar](#collar)
- [deepFreeze](#deepfreeze)
- [deepSeal](#deepseal)
- [deepPreventExtensions](#deepPreventExtensions)

### toEnum

Convert object or list of strings to enum representation.
Enum representation is immutable (frozen)

```javascript
  import toEnum from 'js-flock/toEnum';

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

### sort

Small wrapper around sort to make sorting more readable and easier to write.

* Undefined and null values are always sorted to bottom of list no matter if ordering is ascending or descending.
* Supports sorting by multiple properties
* Mutates input array in a same way as native [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).


```javascript
  import sort from 'js-flock/sort';

  sort([1,4,2]).asc(); // sort array in ascending order [1, 2, 4]
  sort([1,4,2]).desc(); // sort array in descending order [4, 2, 1]

  // Sort persons [Object] ascending by lowercase firstName
  sort(persons).asc((p) => p.firstName.toLowerCase());

  // Sort persons by multiple properties
  sort(persons).desc([
    (p) => p.firstName, // Sort by first name
    (p) => p.lastName, // Persons that have same firstName will be sorted by lastName
    (p) => p.dob // Persons that have same firstName and lastName will be sorted by dob
  ]);

  // Sorting values that are not sortable will return same value back
  sort(null).asc(); // => null
  sort(33).desc(); // => 33
```


### singular

 Creates singular function that after is called can't be called again until it finishes with execution.
 Singular function injects done function as a first argument of the original function.
 When called done indicates that function has finished with execution and that it can be called again.

 For example we will use Vue.js and click handler.

```html
    <span @click="startConversation()" role="button"></span>
```

```javascript
  export default {
    methods: {
      startConversation: singular(function(done) {
        // After function is called all other calls will be ignored until done is called
        if (this.conversation) { // Computed property that return conversation if exists
          this.$store.dispatch('Chat/conversation/activate', this.conversation.channelId);
          done(); // In this case done is called immediately
          return;
        }

        // If conversation does not exist we need to create it in order to activate it
        ChatService.conversation.createDirect(this.professor.id)
          .then((newConversation) => {
            this.$store.commit('Chat/conversation/add', newConversation);
            this.$store.dispatch('Chat/conversation/activate', newConversation.channelId);
          })
          .catch((err) => {
            Toast.showErrorToast();
            this.$log.error(err);
          })
          .then(done); // In this case done is called asynchronously.
      })
    }
  };
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
      return console.log(err);
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

Promisifies the entire object by going through the object's properties and creating
an async equivalent of each function on the object.
Promisify.all mutates input object by adding promisified versions to object.
It will never overwrite existing properties of object.

By default promisify.all does not loop over object prototype which can be change by providing
{ proto: true } option.

The promisified method name will be the original method name suffixed with suffix (default = 'Async').

```javascript
  const promisify = require('js-flock/promisify');
  const fs = promisify.all(require("fs"));

  fs.readFileAsync('test.txt', 'utf8') // Function appended by promisify.all
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  const withOptions = promisify.all(test, {
    suffix: String, // [default: 'Async'] Suffix will be appended to original method name
    multyArgs: Boolean, // [default: false] Promise will resolve with array of values if set to true. (check promisify for more details),
    proto: Boolean, // [default: false] Promisify object prototype chain if set to true.
    exclude: [String], // [default: undefined] List of object keys that will be skipped
    include: [String], // [default: undefined] If provided promisify all will promisify only keys from this list,
  });
```

### collar

Set maximum waiting time for promise to resolve.
Reject promise if it's not resolved in that time

```javascript
  import collar from 'js-flock/collar';

  const MAX_WAIT_TIME = 500;

  // Http request will be rejected if it's not resolved in 0.5 seconds
  collar(Http.get('test-url'), MAX_WAIT_TIME)
    .then((response) => console.log(response))
    .catch((err) => console.log('promise have timed out'));

  // Collar will reject promise chain as one of promises are not resolved in max time
  collar(Promise.all([
    new Promise((resolve) => setTimeout(resolve, 50, '1')),
    new Promise((resolve) => setTimeout(resolve, 1000, '2'))
  ]), MAX_WAIT_TIME)
  .then(() => { /* not called as second promise have timed out */  })
  .catch((err) => { // CollarError = { isStrangled: true, message: 'Promises have timed out' }
    if (typeof err === 'object' && err.isStrangled) {
      console.log(err.message); // 'Promises have timed out'
    }
  });
```

### deepFreeze

Recursively apply [Object.freez](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

```javascript
  import deepFreeze from 'js-flock/deepFreeze';

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
```

By default deepFreeze do not loop over prototype chain.
That behaviour can be overridden by providing { proto: true } option.
By providing { proto: true } option we instruct deepFreeze to iterate over all enumerable properties of the object itself and those the object inherits from its constructor's prototype.

```javascript
  const ob1 = { test: { a: 'a' } };
  const ob2 = Object.create(ob1);

  deepFreeze(ob2);
  Object.isFrozen(ob2.test); // false - because test property is on ob2 prototype

  deepFreeze(ob2, { proto: true });
  Object.isFrozen(ob2.test); // true
```

### deepSeal

Recursively apply [Object.seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal).
For example check [deepFreeze](#deepfreeze)

### deepPreventExtensions

Recursively apply [Object.preventExtensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions).
For example check [deepFreeze](#deepfreeze)
