const getTag = require('./getTag');

// Public

module.exports = (moduleName) => (type, val) => {
  const tag = getTag(val);
  if (`[object ${type}]` !== tag) {
    throw new TypeError(`${moduleName}: expected [${type}] but got ${tag}]`);
  }
};
