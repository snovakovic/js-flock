import { IDictionary } from "./internals/types";

// >>> INTERNALS <<<

const ensureObject = function(args:any[]|IDictionary) {
  if (Array.isArray(args)) {
    const obj = {} as any;
    args.forEach((key) => { obj[key] = Symbol(key); });
    return obj;
  }

  return typeof args === 'object'
    ? Object.assign({}, args)
    : {};
};

const isClass = function(input:any) {
  return /^class /.test(Function.prototype.toString.call(input));
};

const hardBindFunction = function(obj:IDictionary, key:string) {
  const prop = obj[key];
  if (typeof prop === 'function' && !isClass(prop)) {
    obj[key] = prop.bind(obj);
  }
};

interface IEnumStandardHelpers {
  keys():string[],
  values():string[],
  haveKey(key:any):boolean,
  exists(value:any):boolean,
}

type IEnumReturnType<T> = (
  T extends string[]
    ? { [key in T[number]]: string }
    : T
) & IEnumStandardHelpers;

// >>> PUBLIC <<



function toEnum<T extends IDictionary<any>|string[]>(arg:T):IEnumReturnType<T> {
  const enu = ensureObject(arg);
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
    keySet: null as any as Set<any>,
    valueSet: undefined as any as Set<any>,
  };

  // Append standard enum helpers

  enu.keys = () => keys;
  enu.values = () => values;

  enu.haveKey = (key:string) => {
    state.keySet = state.keySet || new Set(keys);
    return state.keySet.has(key);
  };

  enu.exists = (value:string) => {
    state.valueSet = state.valueSet || new Set(values);
    return state.valueSet.has(value);
  };

  return Object.freeze(enu);
};

export default toEnum;
