// >>> PUBLIC <<<

/**
 * Assert that value is of certain type.
 * @param {string} prefix The prefix to be added in Exception.
 * @param {String} type The type we are asserting for ['String', 'Function', 'Array', ...].
 * @param {any} val The value we want to assert is of certain type.
 */
const assertType = function(prefix, type, val) {
  const tag = Object.prototype.toString.call(val);
  if (`[object ${type}]` !== tag) {
    throw new TypeError(`${prefix}: expected [${type}] but got ${tag}]`);
  }
};

/**
 * Factory function that return assertType function when invoked.
 * @param {string} moduleName Module name will appear inside of TypeError.
 * @returns {Function} Assert type function bounded to moduleName.
 */
module.exports = (moduleName) => (type, val) => assertType(moduleName, type, val);
