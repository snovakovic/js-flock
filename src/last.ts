/**
 * Return last element of array. If predicate is provided return last element
 * for which predicate returns truthy value
 */
function a<T>(
  arr:T[],
  predicate?:(item:T) => boolean,
):T|undefined {
  let length = Array.isArray(arr) ? arr.length : 0;

  if (!length) return undefined;
  if (typeof predicate !== 'function') return arr[length - 1];

  while (--length) {
    if (predicate(arr[length])) return arr[length];
  }

  return undefined;
};
