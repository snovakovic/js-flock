// Public

module.exports = (testVar) => !!(testVar && typeof testVar === 'object' &&
    Object.prototype.toString.call(testVar) === '[object Object]');
