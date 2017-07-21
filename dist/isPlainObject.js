// Public

module.exports = function(testVar) {
  return !!(testVar && typeof testVar === 'object' &&
    Object.prototype.toString.call(testVar) === '[object Object]');
};
