/** Forces a font to load and waits until it is ready to use. */
export function loadFont(descriptor: string): Promise<void> {
  if (!document.fonts) return Promise.resolve();
  return document.fonts.load(descriptor).then(() => undefined);
}
