import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdministrarConsorcios from './pages/administrarConsorcios/AdministrarConsorcios';
import Inicio from './pages/inicio/Inicio';
import Login from './pages/login/Login';
import NotFound from './pages/notFound/NotFound';
import Trabajos from './pages/trabajos/Trabajos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Inicio />} />
          <Route path="login" element={<Login />} />
          <Route path="administrar-edificios" element={<AdministrarConsorcios />} />
          <Route path="trabajos" element={<Trabajos />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 