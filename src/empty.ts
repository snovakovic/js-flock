// >>> PUBLIC <<<

/**
 * Remove all items from array
 * @param {Array[]} props - 1 or more arrays to empty out
 */
export default function(...props:any[][]):void {
  props.forEach((arr:any) => {
    if (Array.isArray(arr)) {
      arr.splice(0, arr.length);
    }
  });
};
