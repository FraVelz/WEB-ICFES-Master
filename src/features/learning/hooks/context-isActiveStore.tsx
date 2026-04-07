import { createContext, useContext, useState, ReactNode } from 'react';

type IsActiveContextType = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const IsActiveContext = createContext<IsActiveContextType | undefined>(undefined);

export const useIsActiveStore = () => {
  const context = useContext(IsActiveContext);
  if (!context) {
    throw new Error('useIsActiveStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <IsActiveContext.Provider value= {{ isActive, setIsActive }
}>
  { children }
  </IsActiveContext.Provider>
  );
};;