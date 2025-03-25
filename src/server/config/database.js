const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // URL por defecto para MongoDB local
        const mongoURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/facturacion';
        
        console.log('Intentando conectar a MongoDB en:', mongoURL);
        
        const conn = await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB conectado exitosamente en: ${conn.connection.host}`);
        
        // Manejadores de eventos de conexión
        mongoose.connection.on('error', err => {
            console.error('Error en la conexión de MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB desconectado. Intentando reconectar...');
        });

        return conn;
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        console.error('Detalles completos del error:', error);
        // No terminamos el proceso, solo registramos el error
        console.error('La aplicación continuará intentando conectarse...');
    }
};

module.exports = connectDB; 