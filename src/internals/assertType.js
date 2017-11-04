// >>> PUBLIC <<<

module.exports = (moduleName) => (type, val) => {
  const tag = Object.prototype.toString.call(val);
  if (`[object ${type}]` !== tag) {
    throw new TypeError(`${moduleName}: expected [${type}] but got ${tag}]`);
  }
};
