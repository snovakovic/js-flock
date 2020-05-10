(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.promiseAll = global.promiseAll || {}, global.promiseAll.js = factory()));
}(this, (function () { 'use strict';

  // >>> PUBLIC <<<
  var promiseAll = function promiseAll(objOrArray) {
    if (Array.isArray(objOrArray)) {
      return Promise.all(objOrArray);
    }

    var objectKeys = Object.keys(objOrArray);
    var promises = objectKeys.map(function (key) {
      return objOrArray[key];
    });
    return Promise.all(promises).then(function (resolvedPromises) {
      var objResponse = {};
      resolvedPromises.forEach(function (resolvedPromise, idx) {
        objResponse[objectKeys[idx]] = resolvedPromise;
      });
      return objResponse;
    });
  };

  return promiseAll;

})));
