module.exports.delay = function(numberOfMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, numberOfMs);
  });
};
