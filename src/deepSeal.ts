import { deep, IDeepActionOptions } from './internals/deep'

// >>> PUBLIC <<<

/**
 * Recursively apply Object.seal on an object and all of the object properties that are either object or function.
 *
 * @param {Object} obj - The object we want to seal
 * @param {Object} [options]
 * @param {boolean} [options.proto=false] - Should we loop over prototype chain or not
 *
 * @returns {Object} Initial object with applied Object.seal
 */
export default <T>(obj:T, options:IDeepActionOptions<T>) => deep('seal', obj, options);
