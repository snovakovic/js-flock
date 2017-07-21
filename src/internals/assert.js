const throwErr = (msg) => { throw new TypeError(msg); };


module.exports.truthy = (cond, msg) => !cond && throwErr(msg);

module.exports.true = (cond, msg) => cond !== true && throwErr(msg);

module.exports.equal = (cond1, cond2, msg) => (cond1 !== cond2) && throwErr(msg);
