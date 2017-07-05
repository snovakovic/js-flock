/**
 * Creates singular function that after is called can't be called again until it finishes with execution.
 * Singular functions injects done function as a first argument of original function.
 * When called done indicates that function has finished with execution and that it can be called again.
 *
 * @since 0.7.0
 * @param {Function} fn - function which execution we want to control
 * @returns {Function} Function with controlled execution
 */
module.exports = function(fn) {
  let inProgress = false;
  const done = () => (inProgress = false);

  return function(...args) {
    if (!inProgress) {
      inProgress = true;
      args.unshift(done);
      fn.apply(this, args);
    }
  };
};
