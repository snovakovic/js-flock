module.exports = function(executeFn) {
  return {
    when(conditionFn, ttl) {
      const limit = new Date(Date.now() + ttl || 5000);
      (function executer() {
        if (Date.now() > limit) {

        }

        return conditionFn() ?
          executeFn() :
          setTimeout(() => executer(), 5);
      }());
    }
  };
};
