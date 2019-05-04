// >>> PUBLIC <<<

module.exports = function(objOrArray) {
  if (Array.isArray(objOrArray)) {
    return Promise.all(objOrArray);
  }

  const objectKeys = Object.keys(objOrArray);
  const promises = objectKeys.map((key) => objOrArray[key]);

  return Promise
    .all(promises)
    .then((resolvedPromises) => {
      const objResponse = {};

      resolvedPromises
        .forEach((resolvedPromise, idx) => {
          objResponse[objectKeys[idx]] = resolvedPromise;
        });

      return objResponse;
    });
};
