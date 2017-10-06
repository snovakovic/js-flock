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
    this.default = {};
    this.opt = options || {
      progress: false
    };

    Object.freeze(this);
  }

  add(fn) {
    assertType('Function', fn);
    const self = this;
    const strategy = { exec: fn };

    return {
      desc(desc) {
        strategy.desc = desc;
        return this;
      },
      rule(rule) {
        strategy.rule = rule;
        self.list.push(strategy);
        return this;
      },
      default() {
        if (self.default.strategy) {
          throw Error('strategy: Multiple defaults are not allowed.');
        }
        self.default.strategy = strategy;
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

    return strategy || this.default.strategy || emptyStrategy;
  }
};
