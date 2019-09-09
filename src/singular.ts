export default function(fn:Function) {
  let inProgress = false;
  const done = () => inProgress = false;

  return function(this:any, ...args:any[]) {
    if (!inProgress) {
      inProgress = true;
      args.unshift(done);
      fn.apply(this, args);
    }
  };
};
