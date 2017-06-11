const uniSorter = function(direction, path, a, b) {
  if (path) {
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

const sort = function(ctx, sorter, path) {
  if (Array.isArray(ctx)) {
    sorter.bind(null, path);
    return ctx.sort(sorter);
  }
  return ctx;
};

module.exports = function(ctx) {
  return {
    asc(path) {
      return sort(ascSorter, ctx, path);
    },
    desc(path) {
      return sort(descSorter, ctx, path);
    }
  };
};
