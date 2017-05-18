/**
* Get promise version of function from error first callback function.
**/
module.exports = function(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      try {
        fn.apply(this, args.concat((err, response) => (
          err ? reject(err) : resolve(response)
        )));
      } catch (err) {
        reject(err);
      }
    });
  };
};
