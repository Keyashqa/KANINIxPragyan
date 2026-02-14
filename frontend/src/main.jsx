import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import App from './App.jsx';
import { RoleProvider } from './context/RoleContext';
import { TriageProvider } from './context/TriageContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <RoleProvider>
          <TriageProvider>
            <App />
          </TriageProvider>
        </RoleProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
