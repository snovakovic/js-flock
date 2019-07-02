// >>> PUBLIC <<<

module.exports = class NumberIterator {
  constructor({ startFrom } = {}) {
    this._currentNumber = Number(startFrom) || 0;
  }

  next() {
    if (this._currentNumber >= Number.MAX_SAFE_INTEGER) {
      throw Error('Number iterator exhausted');
    }

    this._currentNumber++;
    return this._currentNumber;
  }

  current() {
    return this._currentNumber;
  }
};
