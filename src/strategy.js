const assertType = require('./internals/assertType')('strategy');

// Private

const emptyStrategy = Object.freeze({
  exec: () => {},
  desc: 'Strategy not found'
});

// Public

module.exports = class Strategy {
  constructor(options) {
    this.opt = options || {};
    this.list = [];
  }

  add(fn) {
    assertType('Function', fn);
    const strategies = this.list;
    const strategy = { exec: fn };

    return {
      desc(desc) {
        strategy.desc = desc;
        return this;
      },
      rule(rule) {
        strategy.rule = rule;
        strategies.push(strategy);
        return this;
      }
    };
  }

  get(...condition) {
    const strategy = this.list.find((str) => (
      typeof str.rule === 'function'
        ? str.rule(...condition)
        : condition.length && str.rule === condition[0]
    ));

    return strategy || emptyStrategy;
  }
};
