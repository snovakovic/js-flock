const sorter = function(direction, sortBy, thenBy, depth = 0, a, b) {
  const valA = sortBy(a);
  const valB = sortBy(b);

  if (valA === valB) {
    if (thenBy && thenBy.length > depth) {
      return sorter(direction, thenBy[depth], thenBy, depth + 1, a, b);
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
      ? ctx.sort(_sorter.bind(undefined, sortBy.shift(), sortBy, 0))
      : ctx.sort(_sorter.bind(undefined, sortBy, undefined, 0));
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
