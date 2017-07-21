module.exports = function(testVar) {
  if (!testVar || typeof testVar !== 'object') {
    return false;
  }
  return Object.prototype.toString.call(testVar) === '[object Object]';
};
