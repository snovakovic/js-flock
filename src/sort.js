const uniSorter = function(direction, path, a, b) {
  if (path) { // Get the value from object property
    a = path(a);
    b = path(b);
  }

  if (a == null) return 1;
  if (b == null) return -1;
  if (a === b) return 0;
  if (a < b) return direction;
  return -direction;
};

const ascSorter = uniSorter.bind(null, -1);
const descSorter = uniSorter.bind(null, 1);

const sort = function(ctx, path, sorter) {
  if (Array.isArray(ctx)) {
    return ctx.sort(sorter.bind(null, path));
  }
  return ctx;
};

module.exports = function(ctx) {
  return {
    asc(path) {
      return sort(ctx, path, ascSorter);
    },
    desc(path) {
      return sort(ctx, path, descSorter);
    }
  };
};
