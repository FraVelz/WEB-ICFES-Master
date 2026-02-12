import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import App from '@/App';
import '@/styles/global.css';
import '@/styles/scrollAnimations.css';

export default function AppWithProviders() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}
