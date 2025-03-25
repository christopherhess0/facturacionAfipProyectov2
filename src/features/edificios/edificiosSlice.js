import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Thunks
export const fetchEdificios = createAsyncThunk(
  'edificios/fetchEdificios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/edificios`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const importarEdificios = createAsyncThunk(
  'edificios/importarEdificios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/edificios/importar`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const crearEdificio = createAsyncThunk(
  'edificios/crearEdificio',
  async (edificioData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/edificios`, edificioData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const actualizarEdificio = createAsyncThunk(
  'edificios/actualizarEdificio',
  async ({ id, ...edificioData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/edificios/${id}`, edificioData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const eliminarEdificio = createAsyncThunk(
  'edificios/eliminarEdificio',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/edificios/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  edificios: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const edificiosSlice = createSlice({
  name: 'edificios',
  initialState,
  reducers: {
    agregarEdificio: (state, action) => {
      const nuevoEdificio = {
        id: Date.now(),
        nombreEdificio: action.payload.nombreEdificio,
        cuit: action.payload.cuit,
        nombreAdministracion: action.payload.nombreAdministracion
      };
      state.edificios.push(nuevoEdificio);
    },
    editarEdificio: (state, action) => {
      const { id, datos } = action.payload;
      const index = state.edificios.findIndex(e => e.id === id);
      
      if (index !== -1) {
        state.edificios[index] = {
          ...state.edificios[index],
          ...datos
        };
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEdificios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEdificios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.edificios = action.payload;
        state.error = null;
      })
      .addCase(fetchEdificios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(importarEdificios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(importarEdificios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.edificios = action.payload.edificios;
        state.error = null;
      })
      .addCase(importarEdificios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(crearEdificio.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(crearEdificio.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.edificios.push(action.payload);
        state.error = null;
      })
      .addCase(crearEdificio.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(actualizarEdificio.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(actualizarEdificio.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.edificios.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.edificios[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(actualizarEdificio.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(eliminarEdificio.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(eliminarEdificio.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.edificios = state.edificios.filter(e => e._id !== action.payload);
        state.error = null;
      })
      .addCase(eliminarEdificio.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { agregarEdificio, editarEdificio, clearError } = edificiosSlice.actions;

export default edificiosSlice.reducer; 