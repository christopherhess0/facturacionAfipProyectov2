import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import edificiosReducer from '../features/edificios/edificiosSlice';
import trabajosReducer from '../features/trabajos/trabajosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    edificios: edificiosReducer,
    trabajos: trabajosReducer
  }
}); 