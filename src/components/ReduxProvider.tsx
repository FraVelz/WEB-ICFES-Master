'use client';

import { useRef, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppStore } from '@/store/store';

import { UiSessionHydrator } from './UiSessionHydrator';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <UiSessionHydrator />
      {children}
    </Provider>
  );
}
