// Public

module.exports = function(boolExpr, message) {
  if (!boolExpr) {
    throw new TypeError(message);
  }
};
