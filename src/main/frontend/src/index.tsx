import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/services/api';
import { AuthProvider } from '@/context/AuthContext';
import App from './App';
import { ThemeProvider } from './components/theme-provider';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);