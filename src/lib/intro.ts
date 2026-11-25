export const INTRO_EVENT = "intro:done";

/** Run cb once the preloader has finished (immediately if it already has). */
export function onIntro(cb: () => void) {
  if ((window as unknown as { __introDone?: boolean }).__introDone) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}
