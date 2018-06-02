// >>> INTERNALS <<<

const sorter = function(direction, a, b) {
  if (a === b) return 0;
  if (a < b) return -direction;
  if (a == null) return 1;
  if (b == null) return -1;

  return direction;
};

/**
 * String sorter does not support nested property.
 * For nested properties or value transformation (e.g toLowerCase) we should use functionSorter
 * Based on benchmark testing using string sorter is bit faster then using equivalent function sorter
 * @example sort(users).asc('firstName')
 */
const stringSorter = function(direction, sortBy, a, b) {
  return sorter(direction, a[sortBy], b[sortBy]);
};

/**
 * @example sort(users).asc(p => p.address.city)
 */
const functionSorter = function(direction, sortBy, a, b) {
  return sorter(direction, sortBy(a), sortBy(b));
};

/**
 * Return string or function seorter depending on sortBy value
 * @param {Function, String} sortBy
 * @returns {Function} sorter
 */
const getMultiPropertySort = function(sortBy) {
  if (typeof sortBy === 'string') {
    return stringMultiPropertySort; // eslint-disable-line no-use-before-define
  }

  return functionMultiPropertySort; // eslint-disable-line no-use-before-define
};

const multiPropertySort = function(valA, valB, direction, thenBy, depth, a, b) {
  if (valA === valB) {
    if (thenBy.length > depth) {
      return getMultiPropertySort(thenBy[depth])(direction, thenBy[depth], thenBy, depth + 1, a, b);
    }
    return 0;
  }

  return sorter(direction, valA, valB);
};

/**
 * Used when we have sorting by multiple properties and when current sorter is function
 * @example sort(users).asc([p => p.address.city, p => p.firstName])
 */
const functionMultiPropertySort = function(direction, sortBy, thenBy, depth, a, b) {
  return multiPropertySort(sortBy(a), sortBy(b), direction, thenBy, depth, a, b);
};

/**
 * Used when we have sorting by multiple properties and when current sorter is function
 * @example sort(users).asc(['firstName', 'lastName'])
 */
const stringMultiPropertySort = function(direction, sortBy, thenBy, depth, a, b) {
  return multiPropertySort(a[sortBy], b[sortBy], direction, thenBy, depth, a, b);
};

/**
 * Pick sorter based on provided sortBy value
 * @param {Array} ctx - Array that will be sorted
 * @param {undefined, String, Function, Function[]} sortBy
 */
const sort = function(direction, ctx, sortBy) {
  if (!Array.isArray(ctx)) return ctx;

  // Unwrap sortBy if array with only 1 value
  if (Array.isArray(sortBy) && sortBy.length < 2) {
    [sortBy] = sortBy;
  }

  let _sorter;

  if (!sortBy) {
    _sorter = sorter.bind(undefined, direction);
  } else if (typeof sortBy === 'string') {
    _sorter = stringSorter.bind(undefined, direction, sortBy);
  } else if (Array.isArray(sortBy)) {
    _sorter = getMultiPropertySort(sortBy[0]).bind(undefined, direction, sortBy.shift(), sortBy, 0);
  } else {
    _sorter = functionSorter.bind(undefined, direction, sortBy);
  }

  return ctx.sort(_sorter);
};

// >>> PUBLIC <<<

module.exports = function(ctx) {
  return {
    asc: (sortBy) => sort(1, ctx, sortBy),
    desc: (sortBy) => sort(-1, ctx, sortBy)
  };
};
