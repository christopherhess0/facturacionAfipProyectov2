import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Edificios from './pages/Edificios';
import Facturacion from './pages/Facturacion';
import Home from './pages/Home';
import Trabajos from './pages/Trabajos';
import websocketService from './services/websocketService';

function App() {
  useEffect(() => {
    // Iniciar conexión WebSocket
    websocketService.connect();

    // Limpiar al desmontar
    return () => {
      websocketService.close();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trabajos" element={<Trabajos />} />
          <Route path="/edificios" element={<Edificios />} />
          <Route path="/facturacion" element={<Facturacion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 