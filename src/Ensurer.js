// >>> PUBLIC <<<

module.exports = class Ensurer {
  constructor() {
    this._calledMaxOnceCount = 0;
  }

  calledMaxOnce(errorMessage = 'Not allowed to be called more than once') {
    this._calledMaxOnceCount += 1;
    if (this._calledMaxOnceCount > 1) {
      throw Error(errorMessage);
    }
  }
};
