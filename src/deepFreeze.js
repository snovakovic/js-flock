/**
* Recursively apply Object.freez on object and his child's.
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
**/
module.exports = function deepFreeze(obj) {
  Object.freeze(obj);

  Object.keys(obj).forEach((key) => {
    const prop = obj[key];
    if (prop !== null &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      !Object.isFrozen(prop)) {
      deepFreeze(prop);
    }
  });

  return obj;
};
