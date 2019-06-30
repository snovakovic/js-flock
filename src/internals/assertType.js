// >>> PUBLIC <<<

module.exports = (moduleName) => (type, val) => {
  const tag = Object.prototype.toString.call(val);
  // Match both [object Function] and [object AsyncFunction]
  const throwError = type === 'Function'
    ? typeof val !== 'function'
    : `[object ${type}]` !== tag;

  if (throwError) {
    throw new TypeError(`${moduleName}: expected [${type}] but got ${tag}`);
  }
};
