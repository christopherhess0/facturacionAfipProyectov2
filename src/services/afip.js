import Afip from '@afipsdk/afip.js';

// Configuración inicial de AFIP
const afip = new Afip({
    CUIT: 'TU_CUIT_AQUI', // Reemplazar con tu CUIT
    production: false, // true para producción, false para testing
    cert: 'ruta/al/certificado.crt', // Ruta al certificado
    key: 'ruta/a/la/llave.key', // Ruta a la llave privada
});

export default afip; 