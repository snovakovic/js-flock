import isNativeObject from './isNativeObject';

// >>> INTERFACES <<<

export interface IDeepActionOptions<T> {
  proto?:boolean,
  exclude?(key:string, obj:T):boolean,
}

// >>> PUBLIC <<<

/**
 * Recursively apply provided operation on object and all of the object properties that are either object or function.
 * @param {string['freeze', 'seal', 'preventExtensions']} action - The action to be applied on object and his properties
 * @param {Object} obj - The object that will be deeply freeze/seal...
 * @param {Object} [options] - Optional options that controls what will be affected with deep acion
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 * @param {boolean} [options.exclude=Function] - Function that decide should propery be excluded or included.
 * Function accepts key as first parametar and property context(object/function) as second parameter
 * @param {Set} [processed=new Set()] - Used internally to prevent circular references
 * @returns {Object} Initial object with aplied action(freeze/seel/preventExtension) on it
 */
export function deep<T>(
  action: 'freeze' | 'seal' | 'preventExtensions',
  obj:T,
  options:IDeepActionOptions<T>,
  processed:Set<any> = new Set(),
):T {
  // Prevent circular reference
  if (processed.has(obj)) return obj;

  options = options || {};

  (Object as any)[action](obj);
  processed.add(obj);

  // Prevent TypeError: 'caller' and 'arguments' are restricted function
  // properties and cannot be accessed in this context
  if (obj as any === Function.prototype) return obj;

  let ownKeys = Object.getOwnPropertyNames(obj);

  // Not supported in all enviroments
  if (Object.getOwnPropertySymbols) {
    ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(obj) as any);
  }

  ownKeys.forEach((key) => {
    const prop = (obj as any)[key];
    if (prop &&
      (typeof prop === 'object' || typeof prop === 'function') &&
      (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.isView(prop)) && // Prevent issue with freezing buffers
      (typeof options.exclude !== 'function' || !options.exclude(key, obj))) {
      deep(action, prop, options, processed);
    }
  });

  // Freeze object prototype if specified
  if (options.proto) {
    const proto = Object.getPrototypeOf(obj);
    if (proto && !isNativeObject(proto)) {
      deep(action, proto, options, processed);
    }
  }

  return obj;
};
