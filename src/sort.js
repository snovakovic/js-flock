const sorter = function(direction, sortBy, subsequentSort, a, b) {
  const valA = sortBy(a);
  const valB = sortBy(b);

  if (valA === valB) {
    if (subsequentSort && subsequentSort.length) {
      const subsequent = subsequentSort.slice();
      return sorter(direction, subsequent.shift(), subsequent, a, b);
    }
    return 0;
  }

  if (valA == null) return 1;
  if (valB == null) return -1;
  if (valA < valB) return -direction;

  return direction;
};

const ascSorter = sorter.bind(null, 1);
const descSorter = sorter.bind(null, -1);

const emptySortBy = (a) => a;

const sort = function(ctx, _sorter, sortBy = emptySortBy) {
  if (Array.isArray(ctx)) {
    return Array.isArray(sortBy)
      ? ctx.sort(_sorter.bind(undefined, sortBy.shift(), sortBy))
      : ctx.sort(_sorter.bind(undefined, sortBy, undefined));
  }
  return ctx;
};

// Public

module.exports = function(ctx) {
  return {
    asc(sortBy) {
      return sort(ctx, ascSorter, sortBy);
    },
    desc(sortBy) {
      return sort(ctx, descSorter, sortBy);
    }
  };
};
