const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const mongoose = require('mongoose');

// Configurar variables de entorno
dotenv.config();

// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
};

const app = express();

// Configuración de CORS más permisiva para desarrollo
app.use(cors({
    origin: true, // Permite cualquier origen en desarrollo
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Verificar credenciales de Google
const credentialsPath = path.join(__dirname, 'credentials.json');
try {
    require(credentialsPath);
    console.log('Credenciales de Google encontradas correctamente');
} catch (error) {
    console.error('Error al cargar las credenciales de Google:', error.message);
}

// Conectar a la base de datos
connectDB().catch(err => {
    console.error('Error al conectar con MongoDB:', err);
});

// Rutas
app.use('/api/trabajos', require('./routes/trabajos'));
app.use('/api/edificios', require('./routes/edificios'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Facturación funcionando correctamente' });
});

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log('Variables de entorno cargadas:');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Configurado' : 'No configurado');
    console.log('- GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'Configurado' : 'No configurado');
}); 