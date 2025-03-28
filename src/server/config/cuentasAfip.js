const path = require('path');

const cuentasAfip = {
  christopher: {
    nombre: 'Christopher Axel Hess',
    cuit: '20395530661',
    certificado: path.join(process.cwd(), 'certificates_christopher', 'cert.pem'),
    clave: path.join(process.cwd(), 'certificates_christopher', 'key.pem'),
    activa: true
  },
  german: {
    nombre: 'German Horacio Hess',
    cuit: '20143887959',
    certificado: path.join(process.cwd(), 'certificates_german', 'cert.pem'),
    clave: path.join(process.cwd(), 'certificates_german', 'key.pem'),
    activa: true
  },
  nicole: {
    nombre: 'Nicole Melanie Hess',
    cuit: '27423937841',
    certificado: path.join(process.cwd(), 'certificates_nicole', 'cert.pem'),
    clave: path.join(process.cwd(), 'certificates_nicole', 'key.pem'),
    activa: true
  }
};

module.exports = cuentasAfip; 