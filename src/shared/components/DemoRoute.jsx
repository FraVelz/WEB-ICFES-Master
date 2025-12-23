import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const DemoRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const isDemoMode = localStorage.getItem('demoMode') === 'true';

  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
