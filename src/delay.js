// >>> PUBLIC <<<

module.exports = function(numberOfMs = 0) {
  const delay = Number(numberOfMs);
  if (Number.isNaN(delay)) {
    const tag = Object.prototype.toString.call(numberOfMs);
    throw new TypeError(`delay: expected [Number] but got ${tag}`);
  }

  return new Promise((resolve) => {
    setTimeout(resolve, numberOfMs);
  });
};
