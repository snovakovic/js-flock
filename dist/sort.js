const sorter = function(direction, sortBy, a, b) {
  a = sortBy(a);
  b = sortBy(b);

  if (a == null) return 1;
  if (b == null) return -1;
  if (a === b) return 0;
  if (a < b) return direction;
  return -direction;
};

const ascSorter = sorter.bind(null, -1);
const descSorter = sorter.bind(null, 1);

const emptySortBy = (a) => a;

const sort = function(ctx, sortBy = emptySortBy, _sorter) {
  if (Array.isArray(ctx)) {
    return ctx.sort(_sorter.bind(null, sortBy));
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
