// Configurar variables de entorno primero
require('dotenv').config();

console.log('Variables de entorno cargadas:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Configurado' : 'No configurado');
console.log('- GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'Configurado' : 'No configurado');
console.log('- AFIP_CUIT:', process.env.AFIP_CUIT ? 'Configurado' : 'No configurado');

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const mongoose = require('mongoose');
const trabajosRoutes = require('./routes/trabajos');
const edificiosRoutes = require('./routes/edificios');
const facturacionRoutes = require('./routes/facturacion');
const cuentaFacturacionService = require('./services/cuentaFacturacionService');

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
    origin: '*', // Permite cualquier origen
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const { method, url, headers, body } = req;
    console.log(`[${timestamp}] ${method} ${url}`);
    console.log('Headers:', headers);
    if (Object.keys(body || {}).length > 0) {
        console.log('Body:', body);
    }
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
console.log('Configurando rutas...');

app.use('/api/trabajos', trabajosRoutes);
console.log('Ruta /api/trabajos configurada');

app.use('/api/edificios', edificiosRoutes);
console.log('Ruta /api/edificios configurada');

app.use('/api/facturacion', facturacionRoutes);
console.log('Ruta /api/facturacion configurada');

// Ruta de prueba
app.get('/', (req, res) => {
    console.log('Accediendo a la ruta raíz');
    res.json({ message: 'API de Facturación funcionando correctamente' });
});

// Ruta de health check
app.get('/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.json({
            status: 'ok',
            database: dbStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Middleware de manejo de errores
app.use(errorHandler);

// Inicializar servicios
async function initializeServices() {
    try {
        // Cargar cuentas de facturación
        await cuentaFacturacionService.cargarCuentas();
        console.log('Servicios inicializados correctamente');
    } catch (error) {
        console.error('Error al inicializar servicios:', error);
        process.exit(1);
    }
}

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces

// Asegurarse de que el puerto esté libre antes de iniciar el servidor
const server = app.listen(PORT, HOST, async () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
    console.log('Variables de entorno cargadas:');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Configurado' : 'No configurado');
    console.log('- GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'Configurado' : 'No configurado');
    console.log('- AFIP_CUIT:', process.env.AFIP_CUIT ? 'Configurado' : 'No configurado');
    await initializeServices();
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} está en uso. Por favor, cierra todas las instancias del servidor y vuelve a intentar.`);
        process.exit(1);
    } else {
        console.error('Error al iniciar el servidor:', error);
        console.error('Detalles del error:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
    }
}); 