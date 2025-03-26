import {
    Box,
    Paper,
    styled,
    TableCell,
    TableContainer,
    TextField
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';

// Estilos personalizados manteniendo la estética iOS
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 'calc(100vh - 250px)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.3)',
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
  padding: '16px',
  '&.header': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
});

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
}));

const HistorialTrabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const observer = useRef();
  const lastTrabajoRef = useRef();

  const lastTrabajoElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
    lastTrabajoRef.current = node;
  };

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/trabajos/historial?page=${page}&search=${searchTerm}`);
        const newTrabajos = response.data.trabajos;
        
        if (page === 1) {
          setTrabajos(newTrabajos);
        } else {
          setTrabajos(prev => [...prev, ...newTrabajos]);
        }
        
        setHasMore(newTrabajos.length === 10); // Asumiendo que el tamaño de página es 10
        setError(null);
      } catch (err) {
        setError('Error al cargar el historial de trabajos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajos();
  }, [page, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setTrabajos([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Historial de Trabajos</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por edificio, descripción o estado..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {trabajos.map((trabajo, index) => (
          <div
            key={trabajo.id}
            ref={index === trabajos.length - 1 ? lastTrabajoElementRef : null}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{trabajo.edificio}</h3>
                <p className="text-gray-600">{trabajo.descripcion}</p>
                <p className="text-sm text-gray-500">
                  Fecha: {format(new Date(trabajo.fecha), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                trabajo.estado === 'completado' ? 'bg-green-100 text-green-800' :
                trabajo.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {trabajo.estado.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {!loading && !hasMore && trabajos.length > 0 && (
        <p className="text-center text-gray-500 mt-4">
          No hay más trabajos para mostrar
        </p>
      )}
    </div>
  );
};

export default HistorialTrabajos; 