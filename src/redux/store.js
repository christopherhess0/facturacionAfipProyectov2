import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import edificiosReducer from '../features/edificios/edificiosSlice';
import facturaReducer from '../features/facturas/facturaSlice';
import trabajosReducer from '../features/trabajos/trabajosSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['facturas', 'edificios', 'auth', 'trabajos']
};

const rootReducer = combineReducers({
    facturas: facturaReducer,
    edificios: edificiosReducer,
    auth: authReducer,
    trabajos: trabajosReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        })
});

export const persistor = persistStore(store);
