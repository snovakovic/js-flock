function promiseAll<T extends { [key:string]: any }>(objOrArray:T):Promise<{ [key in keyof T]:any }>;
function promiseAll<T> (objOrArray: (T | PromiseLike<T>)[]):Promise<T[]> {
  if (Array.isArray(objOrArray)) {
    return Promise.all(objOrArray);
  }

  const objectKeys = Object.keys(objOrArray);
  const promises = objectKeys.map((key) => objOrArray[key]);

  return Promise
    .all(promises)
    .then((resolvedPromises) => {
      const objResponse = {} as any;

      resolvedPromises
        .forEach((resolvedPromise, idx) => {
          objResponse[objectKeys[idx]] = resolvedPromise;
        });

      return objResponse;
    });
};

export default promiseAll;
