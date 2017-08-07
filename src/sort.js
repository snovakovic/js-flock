const sorter = function(direction, sortBy, subSort, a, b) {
  const valA = sortBy(a);
  const valB = sortBy(b);

  if (valA == null) return 1;
  if (valB == null) return -1;
  if (valA === valB) {
    // Sort by additional properties if provided
    if (subSort && subSort.length) {
      const cloneSubSort = subSort.slice();
      return sorter(direction, cloneSubSort.shift(), cloneSubSort, a, b);
    }
    return 0;
  }

  if (valA < valB) return direction;
  return -direction;
};

const ascSorter = sorter.bind(null, -1);
const descSorter = sorter.bind(null, 1);

const emptySortBy = (a) => a;

const sort = function(ctx, sortBy = emptySortBy, _sorter) {
  if (Array.isArray(ctx)) {
    const sorterFun = Array.isArray(sortBy)
      ? _sorter.bind(null, sortBy.shift(), sortBy)
      : _sorter.bind(null, sortBy, undefined);

    return ctx.sort(sorterFun);
  }
  return ctx;
};

module.exports = function(ctx) {
  return {
    asc(sortBy) {
      return sort(ctx, sortBy, ascSorter);
    },
    desc(sortBy) {
      return sort(ctx, sortBy, descSorter);
    }
  };
};
