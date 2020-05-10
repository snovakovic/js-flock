// >>> INTERNALS <<<

const castObject = function(args) {
  if (Array.isArray(args)) {
    const obj = {};
    args.forEach((key) => { obj[key] = Symbol(key); });
    return obj;
  }

  return typeof args === 'object'
    ? ({ ...args })
    : {};
};

const isClass = function(input) {
  return /^class /.test(Function.prototype.toString.call(input));
};

const hardBindFunction = function(obj, key) {
  const prop = obj[key];
  if (typeof prop === 'function' && !isClass(prop)) {
    obj[key] = prop.bind(obj);
  }
};

// >>> PUBLIC <<<

module.exports = function(arg) {
  const enu = castObject(arg);
  const keys = Object.keys(enu).filter((key) => typeof enu[key] !== 'function');
  const values = keys.map((key) => enu[key]);

  if (new Set(values).size !== values.length) {
    throw new TypeError('toEnum: Duplicate values detected');
  }

  Object.freeze(keys);
  Object.freeze(values);
  Object.keys(enu).forEach((key) => hardBindFunction(enu, key));

  // Lazy load state

  const state = {
    keySet: undefined,
    valueSet: undefined,
  };

  // Append standard enum helpers

  enu.keys = () => keys;
  enu.values = () => values;

  enu.haveKey = (key) => {
    state.keySet = state.keySet || new Set(keys);
    return state.keySet.has(key);
  };

  enu.exists = (value) => {
    state.valueSet = state.valueSet || new Set(values);
    return state.valueSet.has(value);
  };

  return Object.freeze(enu);
};
