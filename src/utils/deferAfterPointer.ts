/** Evita `releasePointerCapture` al desmontar un control durante el mismo evento de puntero. */
export function deferAfterPointer(callback: () => void) {
  requestAnimationFrame(callback);
}
