export function ripString(input: string, rip: number): string {
  return input.split("").reduce((previous, current, index)=>{
      return index % rip === 0 ? previous + current : previous;
  });
}