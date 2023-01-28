
export function pageLimitFromWindowSize ():number {
  return window.innerWidth >= 1400 
    ? 4*4 
    : window.innerWidth >= 1050 
      ? 3*4
      : window.innerWidth >= 700 
        ? 2*4 
        : 4
}