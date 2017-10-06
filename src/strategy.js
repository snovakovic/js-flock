const assertType = require('./internals/assertType')('strategy');

// Private

const emptyStrategy = Object.freeze({
  exec: () => {},
  desc: 'Strategy not found'
});

// Public

module.exports = class Strategy {
  constructor(options) {
    this.list = [];
    this.opt = options || {
      progress: false
    };

    Object.freeze(this);
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
    const action = this.opt.progress ? 'filter' : 'find';
    const strategy = this.list[action]((str) => (
      typeof str.rule === 'function'
        ? str.rule(...condition)
        : condition.length && str.rule === condition[0]
    ));

    return strategy || emptyStrategy;
  }
};
