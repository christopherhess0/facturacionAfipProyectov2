import axios from 'axios';

const SHEET_ID = '1Yh5_3klA9NuJVhYiBhpzRU8Lw3wBAzXPpDQZxVVqXZE';
const API_KEY = 'AIzaSyBNjjCZErVcTXVVtHAYVFhKfFWXf1Rz_io';
const RANGE = 'Trabajos - 2024!A2:G';

export const fetchTrabajos = async () => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (response.data && response.data.values) {
      // Transformar los datos a un formato más manejable
      const trabajos = response.data.values.map(row => ({
        fecha: row[0] || '',
        edificio: row[1] || '',
        direccion: row[2] || '',
        trabajo: row[3] || '',
        estado: row[4] || '',
        facturado: row[5] === 'Sí',
        observaciones: row[6] || ''
      }));

      // Guardar en localStorage para acceso rápido
      localStorage.setItem('trabajos', JSON.stringify(trabajos));
      
      return trabajos;
    }
    return [];
  } catch (error) {
    console.error('Error al cargar datos desde Google Sheets:', error);
    // Intentar cargar desde localStorage si hay un error
    const cachedData = localStorage.getItem('trabajos');
    return cachedData ? JSON.parse(cachedData) : [];
  }
}; 