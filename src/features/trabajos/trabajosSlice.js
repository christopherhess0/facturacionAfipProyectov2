import { createSelector, createSlice } from '@reduxjs/toolkit';

// Función auxiliar para guardar en localStorage
const saveToLocalStorage = (trabajos) => {
  try {
    localStorage.setItem('trabajos', JSON.stringify(trabajos));
    console.log('Trabajos guardados en localStorage:', trabajos);
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
};

// Intentar cargar trabajos desde localStorage al inicio
let trabajosIniciales = [];
try {
  const trabajosGuardados = localStorage.getItem('trabajos');
  if (trabajosGuardados) {
    trabajosIniciales = JSON.parse(trabajosGuardados);
    // Asegurarse de que todos los trabajos tengan el campo facturado
    trabajosIniciales = trabajosIniciales.map(trabajo => ({
      ...trabajo,
      facturado: trabajo.facturado || false
    }));
    console.log('Trabajos cargados desde localStorage:', trabajosIniciales);
  }
} catch (error) {
  console.error('Error al cargar trabajos iniciales:', error);
}

const initialState = {
  trabajos: trabajosIniciales
};

// Selectores base
const selectTrabajosState = state => state.trabajos;
export const selectTrabajos = createSelector(
  [selectTrabajosState],
  trabajosState => trabajosState.trabajos
);

const trabajosSlice = createSlice({
  name: 'trabajos',
  initialState,
  reducers: {
    agregarTrabajo: (state, action) => {
      const nuevoTrabajo = {
        ...action.payload,
        facturado: false // Inicialmente no facturado
      };
      state.trabajos.push(nuevoTrabajo);
      saveToLocalStorage(state.trabajos);
    },
    eliminarTrabajo: (state, action) => {
      state.trabajos = state.trabajos.filter(trabajo => trabajo.id !== action.payload);
      saveToLocalStorage(state.trabajos);
    },
    editarTrabajo: (state, action) => {
      const { id, datos } = action.payload;
      state.trabajos = state.trabajos.map(trabajo =>
        trabajo.id === id ? { ...trabajo, ...datos } : trabajo
      );
      saveToLocalStorage(state.trabajos);
    },
    toggleFacturado: (state, action) => {
      const { id } = action.payload;
      state.trabajos = state.trabajos.map(trabajo =>
        trabajo.id === id ? { ...trabajo, facturado: !trabajo.facturado } : trabajo
      );
      saveToLocalStorage(state.trabajos);
    },
    cargarTrabajos: (state) => {
      try {
        const trabajosGuardados = localStorage.getItem('trabajos');
        if (trabajosGuardados) {
          state.trabajos = JSON.parse(trabajosGuardados);
        }
      } catch (error) {
        console.error('Error al cargar trabajos:', error);
        state.trabajos = [];
      }
    }
  }
});

export const { agregarTrabajo, eliminarTrabajo, editarTrabajo, toggleFacturado, cargarTrabajos } = trabajosSlice.actions;
export default trabajosSlice.reducer; 