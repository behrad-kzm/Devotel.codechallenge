export function groupBy(xs: any, key: string) {
  return xs.reduce((rv: any, x: any) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}


export function getDistinctValues(arr: any[], key: string): string[] {
  const uniqueItems = Array.from(new Set(arr.map(item => item[key])));
  return uniqueItems;
}