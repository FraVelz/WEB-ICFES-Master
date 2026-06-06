import type { AppDispatch } from '@/store/store';
import { setDemoMode } from '@/store/slices/uiSessionSlice';
import { ensureDemoCoinsMinimum } from '@/services/demo/demoCoins';

/** Activa modo demo y persiste en localStorage antes de navegar (evita perder el flag al recargar). */
export function enterDemoMode(dispatch: AppDispatch) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demoMode', 'true');
    ensureDemoCoinsMinimum();
  }
  dispatch(setDemoMode(true));
}

/**
 * Sale del demo e ir al inicio sin tocar Redux antes de navegar
 * (evita un frame donde ProtectedPage muestra el contenido bloqueado).
 */
export function exitDemoModeToHome() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('demoMode');
  window.location.replace('/');
}
