/**
 * Returns promise that resolves after provided amount of ms.
 */
export default function(numberOfMs = 0):Promise<void> {
  const delay = Number(numberOfMs) || 0;

  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
