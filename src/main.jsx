import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config/config.js';
import { PrimeReactProvider } from 'primereact/api';
import App from './App.jsx';
import './index.css';
import 'primeicons/primeicons.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        limit={4}
        closeButton={false}
        pauseOnHover={false}
        draggable={false}
      />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
