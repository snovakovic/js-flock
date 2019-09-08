/**
 * Remove all items from provided array/arrays
 */
export default function(...props:any[][]):void {
  props.forEach((arr:any) => {
    if (Array.isArray(arr)) {
      arr.splice(0, arr.length);
    }
  });
};
