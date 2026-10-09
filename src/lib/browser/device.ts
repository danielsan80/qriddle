export function hasFinePointer(): boolean {
  return window.matchMedia('(any-pointer: fine)').matches;
}
