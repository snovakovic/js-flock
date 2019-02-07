module.exports.shouldNotBeCalled = function() {
  throw Error('Should not be called');
};

module.exports.delay = function(numberOfMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, numberOfMs);
  });
};
