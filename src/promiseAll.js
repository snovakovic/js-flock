const isNativeObject = require('./isNativeObject');

// >>> PUBLIC <<<

module.exports = function promiseAll(objOrArray) {
  if (Array.isArray(objOrArray)) {
    return Promise.all(objOrArray);
  }

  if (!isNativeObject(objOrArray)) {
    throw new TypeError(`promiseAll: provided param should be object or array`);
  }

  const objectKeys = Object.keys(objOrArray);
  const promises = objectKeys.map(key => objOrArray[key]);

  return Promise
    .all(promises)
    .then((resolvedPromises) => {
      const objResponse = {};

      resolvedPromises
        .forEach((resolvedPromise, idx) => {
          objResponse[objectKeys[idx]] = resolvedPromise;
        });
    });
}
