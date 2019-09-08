/**
 * Iterate numbers in sequence by calling next on NumberIterator instance
 */
export default class NumberIterator {
  private _currentNumber:number;

  constructor({ startFrom } = { startFrom: 0 }) {
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
}
