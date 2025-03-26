import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Edificios from './components/Edificios';
import Facturacion from './components/Facturacion';
import Navigation from './components/Navigation';
import Trabajos from './components/Trabajos';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/trabajos" element={<Trabajos />} />
          <Route path="/edificios" element={<Edificios />} />
          <Route path="/facturacion" element={<Facturacion />} />
          <Route path="/" element={<Trabajos />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 