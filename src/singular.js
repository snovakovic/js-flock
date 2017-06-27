module.exports = function(fn) {
  let inProgress = false;
  const done = () => (inProgress = false);

  return function(...args) {
    if (!inProgress) {
      inProgress = true;
      args.push(done);
      fn(...args);
    }
  };
};
