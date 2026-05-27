import { createContext, useContext, useState, type ReactNode } from 'react';

type RoadmapUiContextType = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const RoadmapUiContext = createContext<RoadmapUiContextType | undefined>(undefined);

export const useRoadmapUi = () => {
  const context = useContext(RoadmapUiContext);
  if (!context) {
    throw new Error('useRoadmapUi must be used within a RoadmapUiProvider');
  }
  return context;
};

export const RoadmapUiProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  return <RoadmapUiContext.Provider value={{ isActive, setIsActive }}>{children}</RoadmapUiContext.Provider>;
};
