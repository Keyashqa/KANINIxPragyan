import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1565C0' },
    secondary: { main: '#00897B' },
    background: { default: '#F5F6FA', paper: '#FFFFFF' },
    risk: {
      low: '#388E3C',
      medium: '#F57C00',
      high: '#D32F2F',
      critical: '#B71C1C',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { minHeight: 48, textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6 },
      },
    },
  },
});

export default theme;
