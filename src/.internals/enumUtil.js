const reservedWords = new Set(['keys', 'values', 'haveKey', 'exists']);

const assert = (condition, msg) => {
  if (!condition) { throw new TypeError(`toEnum: ${msg}`); }
};

exports.assertUnique = (arr, values) => {
  assert(new Set(arr).size === arr.length, `Duplicate ${values} detected`);
};

exports.assertKeys = function(keys) {
  assert(keys.length, 'Empty enums are not allowed');
  exports.assertUnique(keys, 'keys');
  assert(keys.every((k) => !reservedWords.has(k.toLowerCase())), `Reserved word have been used
    as key. [keys, values, haveKye, exists] are not allowed as keys`);
};

exports.assertValues = function(values) {
  exports.assertUnique(values, 'values');
  assert(values.every((t) => typeof t === 'string' || typeof t === 'number'),
    'Only strings or numbers are allowed as enum values');
};

exports.assertType = function(args) {
  assert(args && typeof args === 'object', 'Provided value needs to be object or array');
  if (Array.isArray(args)) {
    assert(args.length, 'Empty array is not allowed');
    assert(args.every((a) => typeof a === 'string'), 'Only strings are allowed in array notation');
  }
}

exports.fromArray = function(arr) {
  const obj = {};
  arr.forEach((key) => (obj[key] = key));
  return obj;
}
