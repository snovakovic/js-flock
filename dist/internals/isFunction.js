const getTag = require('./getTag');


// Public

module.exports = (testVar) => !!(testVar && getTag(testVar) === '[object Function]');
